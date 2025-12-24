const db = require("../config/db")

module.exports = {

    async createSession({ userUUID, refreshTokenHash, userAgent, ipAddress, expiresAt }) {
        const [result] = await db.execute(
            `INSERT INTO user_sessions(user_uuid,refresh_token_hash,user_agent,ip_address, expires_at)
            VALUES(?, ?, ?, ?, ?)
            `,
            [userUUID, refreshTokenHash, userAgent, ipAddress, expiresAt]
        )

        return ({ id: result.insertId })
    },

    async findSessionByHash(hash) {
        const [rows] = await db.execute(
            "SELECT * FROM user_sessions WHERE refresh_token_hash = ?",
            [hash]
        )

        return rows[0] || null
    },

    async deleteSessionByHash(hash) {
        const [result] = await db.execute(
            "DELETE FROM user_sessions WHERE refresh_token_hash = ?",
            [hash]
        )

        return result.affectedRows
    },

    async deleteSessionByUserUUID(userUUID) {
        const [result] = await db.execute(
            "DELETE FROM user_sessions WHERE user_uuid = ?",
            [userUUID]
        )
        return result.affectedRows
    },

    async rotateSession(oldHash, newHash, newExpiry) {
        const [result] = await db.execute(
            `
                UPDATE user_sessions
                SET 
                    refresh_token_hash = ?,
                    expires_at = ?,
                    created_at = CURRENT_TIMESTAMP
                WHERE 
                    refresh_token_hash = ?
            `,
            [newHash, newExpiry, oldHash]
        )

        return result.affectedRows
    },



}