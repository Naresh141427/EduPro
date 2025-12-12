const tokenServices = require("./tokenServices.js")
const sessionModel = require("../models/sessionModel.js")
const userModel = require("../models/userModel.js")

const DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30", 10)

async function createSessionForUser(user, ipAddress, userAgent) {

    const rawRefreshToken = tokenServices.generateRefreshToken()

    const refreshTokenHash = tokenServices.hashRefreshToken(rawRefreshToken)

    const expiresAt = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000)

    await sessionModel.createSession({
        userUUID: user.uuid,
        refreshTokenHash: refreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt
    })

    const accessPayload = {
        uuid: user.uuid,
        email: user.email,
        role: user.role

    }

    const accessToken = tokenServices.generateAccessToken(accessPayload)

    return {
        accessToken,
        refreshToken: rawRefreshToken,
        accessPayload,
        expiresAt
    }

}

async function refreshSession(rawRefreshToken) {
    const oldHash = tokenServices.hashRefreshToken(rawRefreshToken)


    const session = await sessionModel.findSessionByHash(oldHash)

    if (!session) {
        throw new Error("Invalid refresh token ")
    }

    if (new Date(session.expires_at) < new Date()) {
        await sessionModel.deleteSessionByHash(oldHash)
        throw new Error("Refresh token expired")
    }

    const user = await userModel.getUserByUUID(session.user_uuid)

    if (!user || !user.is_active) {
        await sessionModel.deleteSessionByHash(oldHash)
        throw new Error("Invalid user for this session")
    }

    const newRawRefreshToken = tokenServices.generateRefreshToken()
    const newHashedRefreshToken = tokenServices.hashRefreshToken(newRawRefreshToken)
    const newExpiry = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000)

    const updated = await sessionModel.rotateSession(oldHash, newHashedRefreshToken, newExpiry)

    if (!updated) {
        throw new Error("Failed to rotate refresh token")
    }

    const payload = { uuid: user.uuid, email: user.email, role: user.role }
    const newAccessToken = await tokenServices.generateAccessToken(payload)

    return {
        accessToken: newAccessToken,
        refreshToken: newRawRefreshToken,
        expiresAt: newExpiry,
        user: payload
    }
}


async function revokeRefreshToken(rawRefreshToken) {
    const hash = tokenServices.hashRefreshToken(rawRefreshToken)
    return sessionModel.deleteSessionByHash(hash)
}


module.exports = {
    createSessionForUser,
    refreshSession,
    revokeRefreshToken
}