import Groq from 'groq-sdk'
import { config } from 'dotenv'
import { extractResumeText } from '../utils/extractResumeText.js';
config()

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

export async function generateCoverLetter(req, res){
    const { resume, jobDescription, companyName } = req.body;
    const resumeFile = req.file;

    if((!resume && !resumeFile) || !jobDescription){
        return res.status(400).json({
            message: "Resume and Job description are required."
        })
    }

    const resumeText = resumeFile ? await extractResumeText(resumeFile) : resume;

    try {
        const companyLine = companyName && companyName !== 'Not Found'
            ? `The company name is "${companyName}". You must address the cover letter to this company by name.`
            : '';

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an expert career coach.
                                Write a professional, personalized cover letter based on the resume and job description.
                                ${companyLine}
                                Return only the final cover letter text.
                                Do not include explanations, labels, markdown, or phrases like "Here's a cover letter".
                                Keep it between 200 and 250 words.
                                Keep it concise, confident, and natural.`
                },
                {
                    role: 'user',
                    content: `Here is the applicant's resume. Find the MOST impressive concrete achievement and build the letter around it:\n\n${resumeText}\n\nHere is the job posting — connect the applicant's experience to what this role specifically needs:\n\n${jobDescription}${companyName && companyName !== 'Not Found' ? `\n\nCompany name: ${companyName}` : ''}`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.85
        });

        res.status(200).json({
            coverLetter: chatCompletion.choices[0]?.message?.content || ""
        })
    } catch (err) {
        res.status(500).json({
            error: "AI error: " + err.message
        })
    }

}