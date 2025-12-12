const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController")
const { loginvalidator } = require("../middlewares/validators/registerValidator")

router.post("/login", loginvalidator, authController.login)

router.post("/refresh", authController.refresh)

router.post("/logout", authController.logout)

module.exports = router