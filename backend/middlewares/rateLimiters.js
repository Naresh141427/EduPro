const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 10, 
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        next(new AppError('Too many requests from this IP, please try again after 15 minutes', 429));
    }
});

module.exports = {
    authLimiter
};
