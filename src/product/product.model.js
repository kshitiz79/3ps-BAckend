// const mongoose = require('mongoose');

// // Pricing Schema
// const pricingSchema = new mongoose.Schema({
//   marketPrice: { type: Number, required: true },
//   finalPrice: { type: Number, required: true },
//   discount: { type: Number, default: 0 },
//   gstPercentage: { type: Number, default: 18 },
//   gstAmount: { type: Number, default: 0 },
//   govFee: { type: Number, default: 0 },
//   description: [{ type: String }]
// });

// // Main Product Schema
// const productSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     image: { type: String, default: "" },
//     pricing: {
//       basic: { type: pricingSchema, required: true },
//       standard: { type: pricingSchema },
//       premium: { type: pricingSchema }
//     },
//     mainContent: {
//       heading: { type: String, required: true },
//       paragraphs: [{ type: String }],
//       subHeadings: {
//         title1: { type: String },
//         text1: { type: String },
//         title2: { type: String },
//         text2: { type: String }
//       }
//     }
//   },
//   { timestamps: true }
// );

// // Pre-save Hook for GST Calculation
// productSchema.pre("save", function (next) {
//   const calculateGst = (plan) => {
//     if (plan && plan.finalPrice) {
//       plan.gstAmount = (plan.finalPrice * (plan.gstPercentage || 0)) / 100;
//     }
//   };

//   if (this.pricing) {
//     calculateGst(this.pricing.basic);
//     calculateGst(this.pricing.standard);
//     calculateGst(this.pricing.premium);
//   }
//   next();
// });

// module.exports = mongoose.model("Product", productSchema);





const mongoose = require('mongoose');

// Pricing Schema
const pricingSchema = new mongoose.Schema(
  {
    marketPrice: { type: Number, required: true },       
    discountPercentage: { type: Number, default: 0 },    
    gstPercentage: { type: Number, default: 18 },        
    governmentFee: { type: Number, default: 0 },     

    // Calculated fields
    discountAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    description: [{ type: String }]
  },
  { timestamps: true }
);

// Main Product Schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, default: "" },

    pricing: {
      basic: { type: pricingSchema, required: true },
      standard: { type: pricingSchema },
      premium: { type: pricingSchema },
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

// Helper function to calculate final price for a single pricing plan
function calculatePrice(plan) {
  if (!plan || !plan.marketPrice) return;

  // 1) discountAmount
  plan.discountAmount = plan.marketPrice * (plan.discountPercentage / 100);

  // 2) discountedPrice
  const discountedPrice = plan.marketPrice - plan.discountAmount;

  // 3) gstAmount on discountedPrice
  plan.gstAmount = discountedPrice * (plan.gstPercentage / 100);

  // 4) finalPrice = discountedPrice + gstAmount + governmentFee
  plan.finalPrice = discountedPrice + plan.gstAmount + plan.governmentFee;
}

// Pre-save Hook for Price Calculation
productSchema.pre("save", function (next) {
  // Calculate for each pricing plan
  if (this.pricing) {
    calculatePrice(this.pricing.basic);
    calculatePrice(this.pricing.standard);
    calculatePrice(this.pricing.premium);
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
