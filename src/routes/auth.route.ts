import { Router } from "express";
import { signupController } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate";
import { signupSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/signup", validateBody(signupSchema), signupController);

export default router;
