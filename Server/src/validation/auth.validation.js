import { body, validationResult } from 'express-validator'

const validate = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    next()
}

export const registerValidation = [
    body('username')
        .notEmpty().withMessage('Username is required.')
        .isLength({ min: 3, max: 30}).withMessage('Username must be between 3 to 30 characters.')
        .isString().withMessage('Username should be a String.'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Email should be valid email address.'),

    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    validate
]