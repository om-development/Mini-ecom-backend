import express from "express";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  getCategories,
  getProductById,
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

// Admin only routes
router.post("/add", authMiddleware, adminMiddleware, createProduct);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteProduct);
router.put("/update/:id", authMiddleware, adminMiddleware, updateProduct);

export default router;
