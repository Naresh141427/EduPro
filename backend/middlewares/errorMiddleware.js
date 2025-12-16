const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
    // Convert unknown errors to AppError
    if (!(err instanceof AppError)) {
        err = new AppError("Something went wrong", 500);
    }

    const { statusCode, message } = err;

    console.error("ERROR 💥", err);

    res.status(statusCode).json({
        status: "error",
        message
    });
};
