const { body } = require("express-validator")

const registerValidator = [
    body("fullname").notEmpty().withMessage("Full name required"),

    body("email").isEmail().withMessage("Valid email is required"),

    body("password")
        .isStrongPassword()
        .withMessage(
            "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
        )
];


const loginValidator = [
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];



module.exports = { registerValidator, loginValidator }