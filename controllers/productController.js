import Product from "../models/Product.js";

const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// Creating a new Product

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, stock } = req.body;

    if (!title || !description || price == null || !category || !image || stock == null) {
      return res.status(400).json({ message: "All fields are required: title, description, price, category, image, stock" });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: "Price and stock must be non-negative" });
    }

    const product = await Product.create(req.body);
    res.json({ message: "Product Created Successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong while uploading product" });
  }
};

// Getting products

// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.json({ products });
//   } catch (err) {
//     res.status(500).json({ message: "Error while getting Products", err });
//   }
// };

// Updatig a product

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    res.json({ message: "Product Updated Successfully", updated });
  } catch (err) {
    res.status(500).json({ message: "Error while updating the product" });
  }
};
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    // Build filter object
    let filter = {};

    // Search filter - search in title and description
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
        { category: { $regex: safeSearch, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "All Categories") {
      filter.category = category;
    }

    // Fetch filtered products
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      products,
      total: products.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Error while getting Products", err });
  }
};

// Admin: get all products with pagination
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Error while getting products" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    // Sort categories alphabetically
    const sortedCategories = categories.sort((a, b) => a.localeCompare(b));

    res.json({ categories: sortedCategories });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching categories",
    });
  }
};

// NEW: Combined endpoint for initial load
export const getProductsWithCategories = async (req, res) => {
  try {
    const [products, categories] = await Promise.all([
      Product.find().sort({ createdAt: -1 }),
      Product.distinct("category"),
    ]);

    const sortedCategories = categories.sort((a, b) => a.localeCompare(b));

    res.json({
      products,
      categories: sortedCategories,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching products and categories",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while deleting product",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
};
