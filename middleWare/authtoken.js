const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        console.log("token", token);

        if (!token) {
            return res.status(401).json({
                message: "Please login!",
                success: false,
                error: true
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("JWT Verify Error:", err);
                return res.status(401).json({
                    message: "Invalid or expired token",
                    success: false,
                    error: true
                });
            }

            req.userId = decoded._id;
            next(); // ✅ only run next() if verified successfully
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || "Server error",
            success: false,
            error: true
        });
    }
}

module.exports = authToken;
