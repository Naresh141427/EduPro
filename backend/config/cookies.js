const env = require("./env.js")


const isProd = env.NODE_ENV === "production";

module.exports = {
    refreshTokenName: "refreshToken",

    refreshToken: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
    },
};
