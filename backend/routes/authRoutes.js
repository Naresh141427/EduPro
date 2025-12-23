const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController")
const { loginValidator, registerValidator } = require("../middlewares/validators/registerValidator")
const asyncHandler = require("../utils/asyncHandler")
const { authLimiter } = require("../middlewares/rateLimiters")


router.post(
    "/signup",
    authLimiter,
    registerValidator,
    authController.registerUser
)

router.post(
    "/login",
    authLimiter,
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