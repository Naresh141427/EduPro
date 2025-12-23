const { validationResult } = require("express-validator")
const userService = require("../services/userServices")
const authServices = require("../services/authServices")
const cookieConfig = require("../config/cookies.js");
const AppError = require("../utils/AppError.js");



exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError("Invalid input", 400);
    }

    const { fullname, email, password } = req.body;

    const user = await userService.createUserService(
        fullname,
        email,
        password
    );

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data:{
            user
        }
    });
};

exports.login = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw new AppError("Invalid input", 400)

    }

    const { email, password } = req.body

    const user = await userService.loginUserService(email, password)

    if (!user) {
        throw new AppError("Invalid email or password", 401)
    }

    const session = await authServices.createSessionForUser(user, req.ip, req.get("User-Agent"))

    res.cookie(
        cookieConfig.refreshTokenName,
        session.refreshToken,
        {
            ...cookieConfig.refreshToken,
            expires: session.expiresAt
        })


    return res.status(200).json({
        success: true,
        message: "Login successfull",
       dat:{
        accessToken: session.accessToken,
         user: {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role,
        }
       }

    })
}

exports.refresh = async (req, res) => {
    const token = req.cookies[cookieConfig.refreshTokenName];

    if (!token) {
        throw new AppError("No refresh token provided", 401);
    }

    const session = await authServices.refreshSession(token);

    res.cookie(
        cookieConfig.refreshTokenName,
        session.refreshToken,
        {
            ...cookieConfig.refreshToken,
            expires: session.expiresAt
        }
    );

    return res.status(200).json({
        success: true,
        message: "Token refreshed",
        data:{
            accessToken: session.accessToken,
            user: session.user
        }
    });
};


exports.logout = async (req, res) => {
    const token = req.cookies[cookieConfig.refreshTokenName];

    if (token) {
        await authServices.revokeRefreshToken(token);
    }

    res.clearCookie(
        cookieConfig.refreshTokenName,
        cookieConfig.refreshToken
    );

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};
