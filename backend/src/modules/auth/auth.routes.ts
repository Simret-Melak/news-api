import { Router } from "express";
import { validateBody } from "../../middlewares/validate";
import { signupSchema } from "./auth.schema";
import { signup } from "./auth.controller";
import { loginSchema } from "./auth.schema";
import { login } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", validateBody(signupSchema), signup);
authRouter.post("/login", validateBody(loginSchema), login);