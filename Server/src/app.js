import express from 'express'
import cors from 'cors'
import connectToDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import aiRouter from './routes/ai.routes.js';
import jobRouter from './routes/job.routes.js';

const app = express()
connectToDb()

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/ai", aiRouter)
app.use("/api/job", jobRouter)

export default app;
