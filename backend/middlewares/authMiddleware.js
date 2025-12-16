const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized: No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new AppError("Access token expired", 401);
        }

        throw new AppError("Invalid access token", 401);
    }
};
