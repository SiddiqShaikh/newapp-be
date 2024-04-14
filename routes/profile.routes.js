import { Router } from "express";
import ProfileController from "../controllers/profile.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/", AuthMiddleware, ProfileController.index);
router.put("/image/:id",AuthMiddleware, ProfileController.update);
export default router;
