import { Router } from "express";
import { loginController, logoutController, registerController } from "../controllers/auth.controller.js";
import { registerValidation } from "../validation/auth.validation.js";

const authRouter = Router()

authRouter.post("/register", registerValidation, registerController)
authRouter.post("/login", loginController)
authRouter.post("/logout", logoutController)
// authRouter.post("/getme")

export default authRouter;
