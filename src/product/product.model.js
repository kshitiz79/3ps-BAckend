


const mongoose = require('mongoose');

// Pricing Schema
const pricingSchema = new mongoose.Schema(
  {
    marketPrice: { type: Number, required: true },       
    discountPercentage: { type: Number, default: 0 },    
    gstPercentage: { type: Number, default: 18 },        
    governmentFee: { type: Number, default: 0 },     


    discountAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    description: [{ type: String }]
  },
  { timestamps: true }
);


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
      },
    },

    documentRequirements: [
      {
        title: { type: String },
        count: { type: Number, default: 0 },
        descriptions: [
          {
            title: { type: String},
            desc: { type: String },
          },
        ],
      },
    ],



  },
  { timestamps: true }
);



productSchema.pre("save", function (next) {
  if (this.documentRequirements && this.documentRequirements.length > 0) {
    this.documentRequirements.forEach((requirement) => {
      requirement.count = requirement.descriptions.length; // Calculate count dynamically
    });
  }
  next();
});



function calculatePrice(plan) {
  if (!plan || !plan.marketPrice) return;

  plan.discountAmount = plan.marketPrice * (plan.discountPercentage / 100);
  const discountedPrice = plan.marketPrice - plan.discountAmount;
  plan.gstAmount = discountedPrice * (plan.gstPercentage / 100);


  plan.finalPrice = discountedPrice + plan.gstAmount + plan.governmentFee;
}

productSchema.pre("save", function (next) {

  if (this.pricing) {
    calculatePrice(this.pricing.basic);
    calculatePrice(this.pricing.standard);
    calculatePrice(this.pricing.premium);
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
