import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        title: String,
        quantity: Number,
        price: Number,
      },
    ],
    address: {
      fullName: {
        type: String,
      },
      phone: String,
      addressLine: String,
      district: String,
      province: String,
      pincode: String,
    },
    totalAmount: Number,
    subtotal: Number,
    tax: Number,
    paymentMethod: {
      type: String,
      default: "cod",
    },
    status: {
      type: String,
      default: "Placed",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", OrderSchema);
