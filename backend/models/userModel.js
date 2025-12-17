const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async createUser(name, email, hashedPassword, role = 'student') {
        const user_uuid = uuidv4();

        const [result] = await db.execute(
            `INSERT INTO users (uuid, name, email, password, role)
             VALUES (?, ?, ?, ?, ?)`,
            [user_uuid, name, email, hashedPassword, role]
        );

        return { id: result.insertId, uuid: user_uuid };
    },

    async getUserByEmail(email) {
        const [rows] = await db.execute(
            `SELECT * FROM users WHERE email = ? LIMIT 1`,
            [email]
        );
        return rows[0];
    },

    async getUserByUUID(uuid) {
        const [rows] = await db.execute(
            `SELECT id, uuid, name, email, role, is_active, created_at
             FROM users WHERE uuid = ? LIMIT 1`,
            [uuid]
        );
        return rows[0];
    },

    async getUserWithPasswordByUUID(uuid) {
        const [rows] = await db.execute(
            `SELECT uuid, password, is_active
             FROM users WHERE uuid = ? LIMIT 1`,
            [uuid]
        );
        return rows[0];
    },

    async updateUser(uuid, data) {
        const { name, email } = data

        const fields = []
        const values = []

        if (name) {
            fields.push("name = ?")
            values.push(name)
        }

        if (email) {
            fields.push("email = ?")
            values.push(email)
        }

        values.push(uuid)

        await db.execute(
            `
                UPDATE users
                SET    
                    ${fields.join(", ")}
                WHERE
                    uuid = ?
            `,
            values
        )

        return this.getUserByUUID(uuid);

    },

    async updateUserPassword(uuid, passwordHash) {

        await db.execute(
            "UPDATE users SET password = ? WHERE uuid = ?",
            [passwordHash, uuid]
        )
    },

    async deactivateUser(uuid) {
        await db.execute(
            "UPDATE users SET is_active=0 WHERE uuid = ?",
            [uuid]
        )
    }
};
