import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, paymentMethod } = req.body;

    // Validate required fields
    if (!address) {
      return res.status(400).json({ 
        message: "Address is required" 
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
      status: "Placed",
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
    });
  }
};

// Get order by ID
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId: req.user.id });

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
    });
  }
};

// Admin: get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error("Error getting all orders:", err);
    res.status(500).json({ message: "Error while fetching orders" });
  }
};

// Admin: update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Error while updating order status" });
  }
};

/// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

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
    });
  }
};