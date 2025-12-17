const AppError = require("../utils/AppError");

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
            throw new AppError("Unauthorized", 401);
        }

        if (!allowedRoles.includes(userRole)) {
            throw new AppError("Forbidden: Access denied", 403);
        }

        next();
    };
};

module.exports = requireRole;
