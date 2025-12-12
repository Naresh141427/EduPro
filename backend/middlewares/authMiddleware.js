const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;


        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];


        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        req.user = decoded;


        next();

    } catch (err) {
        console.error("Auth Middleware Error:", err.message);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Access token expired" });
        }

        return res.status(401).json({ error: "Invalid access token" });
    }
};
