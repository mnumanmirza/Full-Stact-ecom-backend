const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Please provide email and password");
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        console.log("checkPassoword", checkPassword);

        if (!checkPassword) {
            throw new Error("Invalid password");
        }

        // ✅ JWT create
        const tokenData = {
            _id: user._id,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "8h" });

        // ✅ Set cookie properly for deployment
        const cookieOptions = {
            httpOnly: true,
            secure: true,              // must for HTTPS
            sameSite: "none",          // must for cross-origin
            maxAge: 1000 * 60 * 60 * 8 // 8 hours
        };

        // ✅ Send cookie + response
        res.cookie("token", token, cookieOptions).status(200).json({
            message: "Login successful",
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(400).json({
            message: err.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

module.exports = userSignInController;
