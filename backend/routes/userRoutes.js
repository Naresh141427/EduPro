const express = require("express")
const router = express.Router()


const asyncHandler = require("../utils/asyncHandler")
const userController = require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/me", authMiddleware, asyncHandler(userController.getMe))
router.patch("/me", authMiddleware, asyncHandler(userController.updateMe))


module.exports = router