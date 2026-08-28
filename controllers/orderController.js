import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, address, paymentMethod } = req.body;

    // Validate required fields
    if (!userId || !address) {
      return res.status(400).json({ 
        message: "User ID and Address are required" 
      });
    }

    // Get cart with populated products
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Prepare order items and validate stock
    const orderItems = [];
    for (let item of cart.items) {
      const product = item.productId;
      
      // Check if product has sufficient stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      orderItems.push({
        productId: product._id,
        title: product.title,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Calculate total amount (including tax)
    const subtotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1;
    const totalAmount = subtotal + tax;

    // Deduct stock from products
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } },
        { returnDocument: 'after' }
      );
    }

    // Create order
    const order = await Order.create({
      userId,
      address,
      items: orderItems,
      subtotal,
      tax,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
      status: "pending",
      createdAt: new Date(),
    });

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { returnDocument: 'after' }
    );

    res.status(200).json({ 
      message: "Order placed successfully",
      orderId: order._id,
      order,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ 
      message: "Error while placing order", 
      error: err.message 
    });
  }
};

// Get order by ID
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ 
      message: "Order fetched successfully",
      order 
    });
  } catch (err) {
    console.error("Error getting order:", err);
    res.status(500).json({ 
      message: "Error while fetching order",
      error: err.message 
    });
  }
};

/// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.json({ 
      message: "Orders fetched successfully",
      orders 
    });
  } catch (err) {
    console.error("Error getting orders:", err);
    res.status(500).json({ 
      message: "Error while fetching orders",
      error: err.message 
    });
  }
};