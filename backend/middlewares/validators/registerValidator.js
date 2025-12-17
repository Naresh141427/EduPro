const { body } = require("express-validator");


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


const userPasswordUpdateValidator = [
    body("currentPassword")
        .notEmpty()
        .withMessage("current password required"),

    body("newPassword")
        .notEmpty()
        .withMessage("new password required")
        .isStrongPassword()
        .withMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("confirm Passwor required")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("password do not matched")
            }
            return true
        }),

    body("newPassword")
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error("New password must be different from current password")
            }
            return true
        })

]


module.exports = { registerValidator, loginValidator, userPasswordUpdateValidator }