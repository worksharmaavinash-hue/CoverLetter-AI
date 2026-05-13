import axios from "axios";

const API_BASE_URL = import.meta.env.PROD 
    ? 'https://coverletter-ai-vjuw.onrender.com' 
    : 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

export async function extractJobDetails({ jobUrl, jobDescription }) {
    const res = await api.post('/api/job/extract', {
        jobUrl,
        jobDescription
    })

    return res.data
}

export async function generateCoverLetter({ resumeFile, resumeText, jobDescription }) {
    const formData = new FormData()

    if(resumeFile){
        formData.append('resumeFile', resumeFile)
    }

    if(resumeText){
        formData.append('resume', resumeText)
    }

    formData.append('jobDescription', jobDescription)

    const res = await api.post('/api/ai/generate', formData)

    return res.data
}
