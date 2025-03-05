const Product = require("./product.model");

// CREATE: Add a new product
exports.createProduct = async (req, res) => {
  try {
    const { title, image, pricing, mainContent } = req.body;

    // Validate required fields
    if (!title || !mainContent || !pricing || !pricing.basic) {
      return res.status(400).json({
        success: false,
        message: "Title, pricing with basic plan, and mainContent are required.",
      });
    }

    // Create a new produc
    const product = new Product({
      title,
      image: image || "",
      pricing,
      mainContent,
    });

    // This will run the pre-save hook automatically
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error in createProduct:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create product.",
      error: error.message,
    });
  }
};


// READ: Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      data: products,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products.",
      error: error.message,
    });
  }
};

// READ: Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product.",
      error: error.message,
    });
  }
};


// UPDATE: Update a product
exports.updateProduct = async (req, res) => {
  try {
    // 1) Find the existing product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // 2) Update product fields from req.body
    //    This way, when we call .save(), it will trigger the pre-save hook
    product.set(req.body);

    // 3) Save product so pre-save hook runs and recalculates pricing fields
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update product.",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure product exists before deleting
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Failed to delete product.", error);
  }
};