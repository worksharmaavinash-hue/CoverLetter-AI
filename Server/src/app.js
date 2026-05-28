import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectToDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import aiRouter from './routes/ai.routes.js';
import jobRouter from './routes/job.routes.js';

const app = express()
connectToDb()

const allowedOrigins = [
    'http://localhost:5173',
    'https://cover-letter-ai-silk.vercel.app',
    process.env.CLIENT_URL?.replace(/\/$/, '')
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/ai", aiRouter)
app.use("/api/job", jobRouter)

export default app;
