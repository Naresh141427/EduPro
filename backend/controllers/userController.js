const { validationResult } = require("express-validator");
const { createUserService } = require("../services/userServices");

const registerUser = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        const user = await createUserService(fullname, email, password);

        return res.status(201).json({
            message: "User registered successfully",
            data: user
        });
    } catch (err) {
        console.error("Registration Error:", err.message);
        if (err.message === "Email already exists") {
            return res.status(409).json({ error: err.message });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
};


const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        const userData = await loginUserService(email, password)

        return res.status(200).json({
            message: "Login successfull",
            data: userData
        })

    } catch (err) {
        console.error("Login Error: ", err.message);

        if (err.message === "Invalid email or password") {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal server error" })

    }
}

module.exports = { registerUser };
