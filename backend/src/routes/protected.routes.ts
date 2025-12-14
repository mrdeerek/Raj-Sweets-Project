import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Access granted",
    user: (req as any).user
  });
});

export default router;
