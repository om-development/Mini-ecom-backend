import express from "express";
import {
  placeOrder,
  getOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/place", authMiddleware, placeOrder);
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);
router.get("/user/me", authMiddleware, getUserOrders);
router.get("/:orderId", authMiddleware, getOrder);
router.patch("/:orderId/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
