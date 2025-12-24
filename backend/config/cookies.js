const env = require("./env.js")


const isProd = env.NODE_ENV === "production";

module.exports = {
    refreshTokenName: "refreshToken",

    attributes: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
    },
};
