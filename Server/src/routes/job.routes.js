import { Router } from "express";
import { extractJobDetails } from "../controllers/job.controller.js";

const jobRouter = Router()

jobRouter.post('/extract', extractJobDetails)

export default jobRouter;