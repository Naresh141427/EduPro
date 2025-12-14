const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController")
const { loginValidator, registerValidator } = require("../middlewares/validators/registerValidator")


router.post("/signup", registerValidator, authController.registerUser)

router.post("/login", loginValidator, authController.login)

router.post("/refresh", authController.refresh)

router.post("/logout", authController.logout)

module.exports = router