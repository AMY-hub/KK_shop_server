const jwt = require('jsonwebtoken');
const ApiError = require('../error/apiError');
const tokenService = require('../services/tokenService');

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return next(ApiError.unauthorized());
        }
        const token = authHeader.split(' ')[1];
        if(!token) {
            return next(ApiError.unauthorized());
        }
        const userData = tokenService.validateAccessToken(token);
        if(!userData) {
            return next(ApiError.unauthorized());
        }
        req.user = userData;
        next();

    } catch(err) {
        res.status(401).json({message: "Пользователь не авторизован."});
    }
};