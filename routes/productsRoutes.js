import express from "express";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
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

export default router;
