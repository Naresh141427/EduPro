const mysql = require('mysql2/promise');
const env = require("./env")

const pool = mysql.createPool({
    host: env.DB.HOST,
    user: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,
    port: env.DB.PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
