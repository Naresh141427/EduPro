
const rolePermissons = require("../config/rolePermissions")
const AppError = require("../utils/AppError")

const requirePermission = (permission) => {
    return (req, res, next) => {

        const userRole = req.user?.role
        if (!userRole) {
            throw new AppError("Unanthorized", 401)
        }

        const allowedPermissions = rolePermissons[userRole] || []
        if (!allowedPermissions.includes(permission)) {
            throw new AppError("Forbidden: Permission denied", 403)
        }

        next()
    }
}

module.exports = requirePermission