import { PDFParse } from 'pdf-parse'
import { createWorker } from 'tesseract.js'

export async function extractResumeText(file) {
    if(!file){
        throw new Error('Resume file is required')
    }

    if(file.mimetype === 'application/pdf') {
        const parser = new PDFParse({ data: file.buffer })
        
        try {
            const data = await parser.getText()
            return data.text.replace(/\s+/g, ' ').trim()
        } finally {
            await parser.destroy()
        }
    }

    if(file.mimetype.startsWith('image/')){
        const worker = await createWorker('eng')

        try{
            const result = await worker.recognize(file.buffer)
            return result.data.text.replace(/\s+/g, ' ').trim()
        } finally {
            await worker.terminate()
        }
    }

    throw new Error('Unsupported resume file type')
}