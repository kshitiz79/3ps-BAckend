const mongoose = require('mongoose');

// Pricing Schema
const pricingSchema = new mongoose.Schema({
  marketPrice: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  gstPercentage: { type: Number, default: 18 },
  gstAmount: { type: Number, default: 0 },
  govFee: { type: Number, default: 0 },
  description: [{ type: String }]
});

// Main Product Schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, default: "" },
    pricing: {
      basic: { type: pricingSchema, required: true },
      standard: { type: pricingSchema },
      premium: { type: pricingSchema }
    },
    mainContent: {
      heading: { type: String, required: true },
      paragraphs: [{ type: String }],
      subHeadings: {
        title1: { type: String },
        text1: { type: String },
        title2: { type: String },
        text2: { type: String }
      }
    }
  },
  { timestamps: true }
);

// Pre-save Hook for GST Calculation
productSchema.pre("save", function (next) {
  const calculateGst = (plan) => {
    if (plan && plan.finalPrice) {
      plan.gstAmount = (plan.finalPrice * (plan.gstPercentage || 0)) / 100;
    }
  };

  if (this.pricing) {
    calculateGst(this.pricing.basic);
    calculateGst(this.pricing.standard);
    calculateGst(this.pricing.premium);
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
