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
    paymentMethod: {
      type: String,
      default: "Cod",
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
