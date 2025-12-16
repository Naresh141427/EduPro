

const userModel = require("../models/userModel")
const AppError = require("../utils/AppError")
const userServices = require("../services/userServices")


exports.getMe = async (req, res) => {
    const userUUID = req.user.uuid

    const user = await userModel.getUserByUUID(userUUID)
    if (!user) {
        throw new AppError("User not found", 404)
    }
    if (!user.is_active) {
        throw new AppError("User account is disabled", 403)
    }

    return res.status(200).json({
        user: {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
}


exports.updateMe = async (req, res) => {
    const userUUID = req.user.uuid

    const { name, email } = req.body
    if (!name && !email) {
        throw new AppError("Nothing to update", 400)
    }

    const updatedUser = await userServices.updateUserService(userUUID, { name, email })

    return res.status(200).json({
        message: "Proile updated successfully",
        user: updatedUser
    })

}