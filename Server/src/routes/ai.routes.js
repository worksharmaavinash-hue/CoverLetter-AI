import { Router } from 'express'
import { generateCoverLetter } from '../controllers/ai.controller.js';
import { uploadResume } from '../middleware/upload.middleware.js';

const aiRouter = Router()

aiRouter.post('/generate', uploadResume.single('resumeFile'), generateCoverLetter);

export default aiRouter;