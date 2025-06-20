const productModel = require("../../models/productModel");

const searchProduct = async (req, res) => {
    try {
        const query = req.query.q?.trim(); 

   
        if (!query) {
            return res.status(400).json({
                message: "Search query is required",
                error: true,
                success: false
            });
        }

        const regex = new RegExp(query, 'i');

        const products = await productModel.find({
            "$or": [
                { productName: regex },
                { category: regex }
            ]
        });

        return res.status(200).json({
            data: products,
            message: "Search results retrieved successfully",
            error: false,
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

module.exports = searchProduct;
