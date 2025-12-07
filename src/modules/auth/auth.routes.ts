import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/signup", authControllers.signupUser);

router.post("/signin", authControllers.signinUser);

export const authRoutes = router;
