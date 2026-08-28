import express from "express";
import {
  addToCart,
  getCart,
  removeItem,
  updateQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

// To add cart

router.post("/add", addToCart);

// To remove Item

router.post("/remove", removeItem);

// To update item quantity in cart

router.post("/update", updateQuantity);

// To get cart of one userId

router.get(`/:userId`, getCart);

export default router;
