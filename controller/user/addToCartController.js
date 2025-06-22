const addToCartModel = require("../../models/addToCartModel");

const addToCartController = async (req, res) => {
    try {
        const { productId } = req.body;
        const currentUser = req.userId;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
                success: false,
                error: true
            });
        }

        const isProductAvailable = await addToCartModel.findOne({ productId, userId: currentUser });

        if (isProductAvailable) {
            return res.status(409).json({
                message: "Product already exists in cart",
                success: false,
                error: true
            });
        }

        const payload = {
            productId: productId,
            quantity: 1,
            userId: currentUser,
        };

        const newAddToCart = new addToCartModel(payload);
        const saveProduct = await newAddToCart.save();

        return res.status(201).json({
            data: saveProduct,
            message: "Product added to cart successfully",
            success: true,
            error: false
        });

    } catch (err) {
        return res.status(500).json({
            message: err?.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

module.exports = addToCartController;
