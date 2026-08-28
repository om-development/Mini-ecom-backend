import express from "express";
import {
  getProducts,
  getAllProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  getCategories,
  getProductById,
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const router = express.Router();

// Admin only routes (must come before /:id to avoid route conflicts)
router.get("/all", authMiddleware, adminMiddleware, getAllProducts);
router.post("/add", authMiddleware, adminMiddleware, createProduct);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteProduct);
router.put("/update/:id", authMiddleware, adminMiddleware, updateProduct);

// Public routes
router.get("/categories", getCategories);
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
