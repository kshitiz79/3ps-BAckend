const express = require("express");
const router = express.Router();
const Form = require("./form.model");

// POST: Submit form data
router.post("/submit", async (req, res) => {
  try {
    const { name, email, phone, gstin } = req.body;

    // Validate input fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required.",
      });
    }

    // Save form data to the database
    const newForm = new Form({
      name,
      email,
      phone,
      gstin: gstin || false,
    });

    const savedForm = await newForm.save();

    res.status(201).json({
      success: true,
      message: "Form submitted successfully.",
      data: savedForm,
    });
  } catch (error) {
    console.error("Error in form submission:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit form.",
      error: error.message,
    });
  }
});

// GET: Retrieve all form submissions
router.get("/submissions", async (req, res) => {
  try {
    const submissions = await Form.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Form submissions retrieved successfully.",
      data: submissions,
    });
  } catch (error) {
    console.error("Error retrieving submissions:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve submissions.",
      error: error.message,
    });
  }
});

module.exports = router;
