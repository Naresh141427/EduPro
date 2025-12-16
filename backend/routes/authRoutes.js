const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController")
const { loginValidator, registerValidator } = require("../middlewares/validators/registerValidator")
const asyncHandler = require("../utils/asyncHandler")



router.post(
    "/signup",
    registerValidator,
    authController.registerUser
)

router.post(
    "/login",
    loginValidator,
    asyncHandler(authController.login)
)

router.post(
    "/refresh",
    asyncHandler(authController.refresh)
)

router.post(
    "/logout",
    asyncHandler(authController.logout)
)



module.exports = router