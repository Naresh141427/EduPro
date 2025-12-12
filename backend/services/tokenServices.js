const crypto = require("crypto")
const jwt = require("jsonwebtoken")

module.exports = {

    generateRefreshToken() {
        return crypto.randomBytes(48).toString("hex")
    },

    hashRefreshToken(token) {
        return crypto.createHash("sha256").update(token).digest("hex")
    },

    generateAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "15m" })
    }
}