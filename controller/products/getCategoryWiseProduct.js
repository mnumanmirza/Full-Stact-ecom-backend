const productModel = require("../../models/productModel");

const getCategoryWiseProduct = async (req, res) => {
  try {
    // Extract category from request body or query params
    const { category } = req.body || req.query;

    // Validate category input
    if (!category) {
      return res.status(400).json({
        message: "Category is required",
        error: true,
        success: false,
      });
    }

    // Fetch products by category
    const products = await productModel.find({ category });

    // Check if no products found
    if (!products.length) {
      return res.status(404).json({
        data: [],
        message: "No products found for the given category",
        success: true,
        error: false,
      });
    }

    // Send successful response
    res.status(200).json({
      data: products,
      message: "Products retrieved successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    // Handle server error
    res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

module.exports = getCategoryWiseProduct;
