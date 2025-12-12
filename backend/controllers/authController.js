const { validationResult } = require("express-validaotr")
const userService = require("../services/userServices")
const authServices = require("../services/authServices")


const COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken"
const COOKIE_SECURE = process.env.COOKIE_SECURE || true
const COOKIE_HTTP_ONLY = process.env.COOKIE_HTTP_ONLY !== false
const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || "None"

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })

        }

        const { email, password } = req.body

        const user = await userService.loginUserService(email, password)

        const session = await authServices.createSessionForUser(user, req.ip, req.get("User-Agent"))

        res.cookie(COOKIE_NAME, session.refreshToken, {
            httpOnly: COOKIE_HTTP_ONLY,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SAME_SITE,
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
                error: error.message
            })
        }

        return res.status(500).json({
            message: "Internal server errror"
        })

    }

}

exports.refresh = async (req, res) => {
    try {

        const token = req.cookies(COOKIE_NAME)

        if (!token) {
            return res.status(401).json({
                error: "No refresh token provided"
            })
        }

        const session = await authServices.refreshSession(token)

        res.cookie(COOKIE_NAME, session.refreshToken, {
            httpOnly: COOKIE_HTTP_ONLY,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SAME_SITE,
            expires: session.expiresAt
        })


        return res.status(200).json({
            message: "Token refreshed",
            data: {
                token: session.accessToken,
                user: session.user
            }
        })

    } catch (error) {
        console.log("Token refresh error: ", err.message);
        return res.status(401).json({
            error: "Invalid or expired refresh token"
        });
    }
}

exports.logout = async (req, res) => {
    try {

        const token = req.cookies(COOKIE_NAME)

        if (token) {
            await authServices.revokeRefreshToken(token)
        }

        res.clearCookie(COOKIE_NAME, {
            hhtpOnly: COOKIE_HTTP_ONLY,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SAME_SITE
        })

        return res.status(200).json({
            message: "Logout successfull"
        })

    } catch (error) {
        console.error("Logout Error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }

}
