// What this gives us
//     HTTP status code awareness
//     Distinguishes expected errors vs bugs
//     Clean stack traces

class AppError extends Error {

    constructor(message, statusCode) {
        super(message)

        this.statusCode = statusCode;
        this.status = `${statusCode}.startsWith("4) ? "fail" : "error"`;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError