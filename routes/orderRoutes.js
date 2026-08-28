import express from "express";
import {
  placeOrder,
  getOrder,
  getUserOrders,
} from "../controllers/orderController.js";

const router = express.Router();
//  order routes
router.post("/place", placeOrder);
router.get("/:orderId", getOrder);
router.get("/user/:userId", getUserOrders);

export default router;
