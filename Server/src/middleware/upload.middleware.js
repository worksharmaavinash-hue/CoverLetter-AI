import multer from 'multer'

const storage = multer.memoryStorage()

export const uploadResume = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/jpg'
        ]

        if(!allowedTypes.includes(file.mimetype)){
            return cb(new Error('Only PDF, PNG, JPG, and JPEG files are allowed'))
        }

        cb(null, true)
    }
})