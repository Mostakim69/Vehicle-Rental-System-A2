import { Router } from "express";
import auth from "../../middleware/auth";
import { userController } from "./users.controller";

const router = Router();

router.get("/", auth("admin"), userController.getAllUser);

router.put("/:id", auth("admin", "customer"), userController.updateUser);

export const userRoutes = router;
