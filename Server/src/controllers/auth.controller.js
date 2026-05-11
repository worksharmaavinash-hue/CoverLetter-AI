import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

function getJwtSecret() {
    return process.env.JWT_SECRET || process.env.JWt_SECRET;
}

function sanitizeUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email
    };
}

export async function registerController(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Username, email, and password are required"
        })
    }

    const existingUser = await userModel.findOne({email})

    if(existingUser){
        return res.status(400).json({
            message: "User is already exist with this email"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, getJwtSecret(), { expiresIn: '7d'})

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    
    res.status(200).json({
        message: "User register successfully",
        user: sanitizeUser(user)
    })
}

export async function loginController(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        })
    }

    const user = await userModel.findOne({ email })

    if(!user){
        return res.status(401).json({
            message: "Email not exists."
        })
    }

    const comparePass = await bcrypt.compare(password, user.password)

    if(!comparePass){
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, getJwtSecret(), { expiresIn: '7d'})

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "User logged in successfully",
        user: sanitizeUser(user)
    })
}

export async function logoutController(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax'
    })

    res.status(200).json({
        message: "User logged out successfully"
    })
}
