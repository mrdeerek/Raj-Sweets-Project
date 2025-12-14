import { Router } from "express";
import {
  addSweet,
  getSweets,
  getSweetById,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  rateSweet
} from "../controllers/sweet.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.get("/search", searchSweets);
router.get("/:id", getSweetById);
router.post("/", authMiddleware, adminMiddleware, addSweet);
router.get("/", getSweets);
router.put("/:id", authMiddleware, adminMiddleware, updateSweet);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSweet);

router.post("/:id/purchase", authMiddleware, purchaseSweet);
router.post("/:id/restock", authMiddleware, adminMiddleware, restockSweet);
router.post("/:id/rate", authMiddleware, rateSweet);


export default router;
