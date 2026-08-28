import express from "express";
import {
  placeOrder,
  getOrder,
  getUserOrders,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", authMiddleware, placeOrder);
router.get("/:orderId", authMiddleware, getOrder);
router.get("/user/me", authMiddleware, getUserOrders);

export default router;
