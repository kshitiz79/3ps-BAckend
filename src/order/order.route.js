const express = require("express");
const Order = require("./order.model");
const { verifyToken } = require("./../middleware/tokenutils");
const router = express.Router();

// Route to submit a new order
router.post("/submit", async (req, res) => {
  try {
    const { userDetails, cartItems, totalPrice } = req.body;

    // Check if cartItems have valid ids
    cartItems.forEach((item, index) => {
      if (!item.id) {
        console.warn(`Missing id for cart item at index ${index}:`, item);
      }
    });

    const newOrder = new Order({ userDetails, cartItems, totalPrice });
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});




// Route to fetch all orders (Admin only)
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

module.exports = router;
