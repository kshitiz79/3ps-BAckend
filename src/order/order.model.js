const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userDetails: {
      userName: { type: String, required: true },
      userEmail: { type: String, required: true },
      userPhone: { type: String, required: true },
    },
    cartItems: [
      {
        id: { type: String }, // Optional or required based on your needs
        name: { type: String, required: true },
        price: { type: Number, required: true },
        plan: { type: String },
        imageUrl: { type: String },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
