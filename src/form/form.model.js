const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gstin: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Form", formSchema);
