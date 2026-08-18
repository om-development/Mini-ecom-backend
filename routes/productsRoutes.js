import express from "express";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  getCategories,
  getProductById,
} from "../controllers/productController.js";
import { get } from "mongoose";

const router = express.Router();

// To create new product

router.post("/add", createProduct);

// To get products

router.get("/", getProducts);

// To delete products

router.delete("/delete/:id", deleteProduct);

// To update product

router.put("/update/:id", updateProduct);

// To get categories

router.get("/categories", getCategories);

// To get product by id

router.get("/:id", getProductById);
export default router;
