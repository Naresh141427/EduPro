const { validationResult } = require("express-validator")
const userService = require("../services/userServices")
const authServices = require("../services/authServices")
const cookieConfig = require("../config/cookies.js")


exports.registerUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        const user = await userService.createUserService(fullname, email, password);

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



exports.login = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })

        }

        const { email, password } = req.body

        const user = await userService.loginUserService(email, password)

        const session = await authServices.createSessionForUser(user, req.ip, req.get("User-Agent"))

        res.cookie(
            cookieConfig.refreshTokenName,
            session.refreshToken,
            {
                ...cookieConfig.refreshToken,
                expires: session.expiresAt
            })


        return res.status(200).json({
            message: "Login successfull",
            data: {
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                role: user.role,
                token: session.accessToken
            }
        })
    } catch (err) {
        console.error("Login Error: ", err.message);

        if (err.message === "Invalid email or password") {
            return res.status(401).json({
                error: err.message
            })
        }

        return res.status(500).json({
            message: "Internal server errror"
        })

    }

}

exports.refresh = async (req, res) => {
    try {

        const token = req.cookies[cookieConfig.refreshTokenName]

        if (!token) {
            return res.status(401).json({
                error: "No refresh token provided"
            })
        }

        const session = await authServices.refreshSession(token)

        res.cookie(
            cookieConfig.refreshTokenName,
            session.refreshToken,
            {
                ...cookieConfig.refreshToken,
                expires: session.expiresAt
            })



        return res.status(200).json({
            message: "Token refreshed",
            data: {
                token: session.accessToken,
                user: session.user
            }
        })

    } catch (err) {
        console.log("Token refresh error: ", err.message);
        return res.status(401).json({
            error: "Invalid or expired refresh token"
        });
    }
}

exports.logout = async (req, res) => {
    try {
        const token = req.cookies[cookieConfig.refreshTokenName];

        if (token) {
            await authServices.revokeRefreshToken(token);
        }

        res.clearCookie(
            cookieConfig.refreshTokenName,
            cookieConfig.refreshToken
        );

        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (err) {
        console.error("Logout Error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
