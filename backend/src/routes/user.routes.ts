import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

// Get all users (Admin only)
router.get("/", authMiddleware, adminMiddleware, getAllUsers);



export default router;
