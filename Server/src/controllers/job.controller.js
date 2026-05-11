import axios from 'axios'
import * as cheerio from 'cheerio'
import Groq from 'groq-sdk'
import { config } from 'dotenv'

config()

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

function parseAiJson(content) {
    const cleanedContent = content
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

    try {
        return JSON.parse(cleanedContent);
    } catch (error) {
        const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw error;
    }
}

async function extractJobWithAi(rawText, pageTitle = ''){
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You extract job posting details from messy scraped webpage text. Return only valid JSON. Do not include markdown. Ignore navigation, login prompts, ads, recommendations, similar jobs, cookie text, and footer content.'
            },
            {
                role: 'user',
                content: `Page title: ${pageTitle}
                
                Scraped text: 
                ${rawText}

                Return this exact JSON shape:
                {
                    "companyName": "",
                    "jobTitle": "",
                    "location": "",
                    "jobType": "",
                    "salary": "",
                    "fullJobDescription": ""
                }

                Rules:
                - If a value is missing, use "Not Found".
                - fullJobDescription should contain only the actual job description.
                - Do not include similar jobs or unrelated page UI.`
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1
    })

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    return parseAiJson(content);
}

function formatSalary(baseSalary){
    const salaryValue = baseSalary?.value;

    if (!salaryValue) {
        return 'Not Found'
    }

    const currency = baseSalary.currency || '';

    if(salaryValue.minValue && salaryValue.maxValue){
        const minValue = Number(salaryValue.minValue);
        const maxValue = Number(salaryValue.maxValue);

        if(minValue && maxValue && minValue < 1000 && maxValue >= 100000){
            return `${minValue * 1000} - ${maxValue} ${currency}`.trim()
        }

        return `${salaryValue.minValue} - ${salaryValue.maxValue} ${currency}`.trim()
    }

    if(salaryValue.value){
        return `${salaryValue.value} ${currency}`.trim()
    }

    return 'Not Found'
}

export const extractJobDetails = async (req, res) => {
    const { jobUrl, jobDescription } = req.body

    if(!jobUrl && !jobDescription){
        return res.status(400).json({
            message: "Job URL or Job description is required"
        })
    }

    if(jobDescription){
        const aiExtractedJob = await extractJobWithAi(jobDescription)

        return res.status(200).json({
            companyName: aiExtractedJob.companyName || 'Not Found',
            jobTitle: aiExtractedJob.jobTitle || 'Not Found',
            location: aiExtractedJob.location || 'Not Found',
            jobType: aiExtractedJob.jobType || 'Not Found',
            salary: aiExtractedJob.salary || 'Not Found',
            fullJobDescription: aiExtractedJob.fullJobDescription || jobDescription
        })
    }

    try {
        const response = await axios.get(jobUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Referer': 'https://www.google.com/',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        let structuredJob = null;

        $('script[type="application/ld+json"]').each((_, element) => {
            try {
                const jsonText = $(element).text();
                const parsed = JSON.parse(jsonText);

                const items = Array.isArray(parsed) ? parsed : [parsed];

                for (const item of items) {
                    if(item['@type'] === 'JobPosting') {
                        structuredJob = item;
                        return false
                    }

                    if (Array.isArray(item['@graph'])) {
                        const jobPosting = item['@graph'].find(graphItem => graphItem['@type'] === 'JobPosting');

                        if(jobPosting){
                            structuredJob = jobPosting;
                            return false
                        }
                    }
                }
            } catch (err) {
                
            }
        })

        $('script, style, nav, header, footer, aside, button, form, iframe').remove()

        const jobTitle = $('title').text().trim() || 'Not Found';
        const companyName = $('meta[property="og:site_name"]').attr('content') || $('meta[name="company"]').attr('content') || 'Not Found'

        if (structuredJob) {
            const structuredCompanyName =
                structuredJob.hiringOrganization?.name ||
                structuredJob.hiringOrganization?.[0]?.name ||
                'Not Found';

            const structuredJobTitle = structuredJob.title || 'Not Found';

            const structuredDescription = structuredJob.description
                ? cheerio.load(structuredJob.description).text().replace(/\s+/g, ' ').trim()
                : 'Not Found';

            const locationData = Array.isArray(structuredJob.jobLocation)
                ? structuredJob.jobLocation[0]
                : structuredJob.jobLocation;

            const address = locationData?.address;

            const structuredLocation = [
                address?.addressLocality,
                address?.addressRegion,
                address?.addressCountry
            ].filter(Boolean).join(', ') || 'Not Found';

            const structuredJobType = Array.isArray(structuredJob.employmentType)
                ? structuredJob.employmentType.join(', ')
                : structuredJob.employmentType || 'Not Found';

            const structuredSalary = formatSalary(structuredJob.baseSalary)

            return res.status(200).json({
                companyName: structuredCompanyName,
                jobTitle: structuredJobTitle,
                location: structuredLocation,
                jobType: structuredJobType,
                salary: structuredSalary,
                fullJobDescription: structuredDescription
            });
        }

        const descriptionSelectors = [
            '.show-more-less-html__markup',
            '.jobs-description-content__text',
            '.description__text',
            '[data-test-job-description]',
            'section.description',
            'main article'
        ];

        let fullJobDescription = '';

        for(const selector of descriptionSelectors){
            const text = $(selector)
            .text()
            .replace(/\s+/g, ' ')
            .trim();

            if(text.length > fullJobDescription.length){
                fullJobDescription = text
            }
        }

        if(!fullJobDescription){
            fullJobDescription = $('body')
            .text()
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 8000) || $('body').text().replace(/\s+/g, ' ').trim().slice(0, 8000);
        }

        const companyMatch = fullJobDescription.match(/Company:\s*(.*?)(?=Location:|Job Type:|Duration:|Stipend:|About|Role Overview:|$)/i);

        const companyAnchor = $('a[href*="/company/"]')
        .first()
        .text()
        .replace(/\s+/g, ' ')
        .trim()

        const titleMatch = fullJobDescription.match(/^(.+?)Company:/i);

        const cleanedCompanyName = companyMatch?.[1]?.trim() ||
            companyAnchor ||
            companyName ||
            'Not Found';

        const cleanedJobTitle = titleMatch ? titleMatch[1].trim() : jobTitle.replace(/\s+in\s+.*?\s+\|\s+LinkedIn/i, '').replace(/^.*hiring\s+/i, '').trim();

        const aiExtractedJob = await extractJobWithAi(fullJobDescription, jobTitle)

        res.status(200).json({
            companyName: aiExtractedJob.companyName || cleanedCompanyName,
            jobTitle: aiExtractedJob.jobTitle || cleanedJobTitle,
            location: aiExtractedJob.location || 'Not Found',
            jobType: aiExtractedJob.jobType || 'Not Found',
            salary: aiExtractedJob.salary || 'Not Found',
            fullJobDescription: aiExtractedJob.fullJobDescription || fullJobDescription
        });

    } catch (err) {
        console.log('Scraping error message:', err.message);
        console.log('Scraping status:', err.response?.status);
        console.log('Scraping data:', err.response?.data?.slice?.(0, 300));

        const blockedByIndeed =
            jobUrl.includes('indeed.') &&
            (
                err.response?.status === 403 ||
                err.response?.data?.includes('Security Check')
            );

        if (blockedByIndeed) {
            return res.status(403).json({
                error: "Indeed blocked scraping for this URL.",
                source: "indeed",
                suggestion: "Please paste the job description manually or use a LinkedIn/company career page URL."
            });
        }

        res.status(500).json({
            error: "Failed to extract job details from the URL.",
            details: err.message,
            status: err.response?.status || null
        });
    }
}
