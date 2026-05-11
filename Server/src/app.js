import express from 'express'
import cors from 'cors'
import connectToDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import aiRouter from './routes/ai.routes.js';
import jobRouter from './routes/job.routes.js';

const app = express()
connectToDb()

const allowedOrigin = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'http://localhost:5173';

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}))

app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/ai", aiRouter)
app.use("/api/job", jobRouter)

export default app;
