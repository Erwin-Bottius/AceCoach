import { Router } from "express";
import {
  loginController,
  logoutController,
  signupController,
} from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate";
import { signupSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/signup", validateBody(signupSchema), signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);

export default router;
