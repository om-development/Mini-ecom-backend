import Product from "../models/Product.js";

// Creating a new Product

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ message: "Product Created Successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong while uploading product", error });
  }
};

// Getting products

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Error while getting Products", err });
  }
};

// Updatig a product

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Product Updated Successfully", updated });
  } catch (err) {
    res.status(500).json({ message: "Error while updating the product", err });
  }
};

// Deleting a product

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error While Deleting", err });
  }
};
