
import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    // User doesn't have a cart yet
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
      });
    } else {
      // Check if product already exists in cart
      const item = cart.items.find(
        (item) => item.productId.toString() === productId,
      );

      if (item) {
        // Product already exists → increase quantity
        item.quantity++;
      } else {
        // Product doesn't exist → add it
        cart.items.push({
          productId,
          quantity: 1,
        });
      }
    }

    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);

    res.status(500).json({
      message: "Error while adding item to cart",
      error: err.message,
    });
  }
};

// To Remove Item From Cart
export const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart,
    });
  } catch (err) {
    console.error("Error removing item:", err);

    res.status(500).json({
      message: "Error while removing item from cart",
      error: err.message,
    });
  }
};

// To Update Quantity

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    item.quantity = quantity;

    await cart.save();
    res.status(200).json({
      message: "Quantity updated successfully",
      cart,
    });
  } catch (err) {
    console.error("Error updating quantity:", err);

    res.status(500).json({
      message: "Error while updating quantity",
      error: err.message,
    });
  }
};

// Get Cart By User ID

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (err) {
    console.error("Error getting cart:", err);

    res.status(500).json({
      message: "Error while getting cart",
      error: err.message,
    });
  }
};
