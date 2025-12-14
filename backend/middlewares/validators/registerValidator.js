const { body } = require("express-validator")

const registerValidator = [
    body("fullname").notEmpty().withMessage("Full name required"),

    body("email").isEmail().withMessage("Valid email is required"),

    body("password")
        .isStrongPassword()
        .withMessage(
            "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
        ),
    body("confirmPassword")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password do not matched")
            }
            return true
        })
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