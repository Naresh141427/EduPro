require('dotenv').config()

const env = {
    NODE_ENV: process.env.NODE_ENV || "development",

    DB: {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        NAME: process.env.DB_NAME,
        PORT: Number(process.env.DB_PORT || 3306)
    },


    JWT: {
        SECRET: process.env.JWT_SECRET,
        EXPIRES: process.env.JWT_EXPIRES || "15m"
    },

    REDIS: {
        HOST: process.env.REDIS_HOST, 
        PORT: Number(process.env.REDIS_PORT || 6379),
        PASSWORD: process.env.REDIS_PASSWORD
    },

    SMTP: {
        HOST: process.env.SMTP_HOST,
        PORT: Number(process.env.SMTP_PORT || 587),
        USER: process.env.SMTP_USER,
        PASS: process.env.SMTP_PASS,
        FROM: process.env.EMAIL_FROM || "noreply@edupro.com"
    },

    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

    PORT: Number(process.env.PORT || 3000),

    REFRESH_TOKEN_EXPIRES_DAYS: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 30)
}

if (env.NODE_ENV === "production" && !env.JWT.SECRET) {
    throw new Error("JWT_SECRET is required in production")
}

module.exports = env