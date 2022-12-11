const ApiError = require('../error/apiError');
const userService = require('../services/userService');
require('dotenv').config();

class UserController {
    async register(req, res, next) {
        try {
            const {
            email, 
            password, 
            role,
            name,
            lastname,
            birthdate} = req.body;
        if(!email || !password) {
            return next(ApiError.internal('Некорректный email или пароль!'));
        }
        if(!name) {
            return next(ApiError.internal('Имя не указано!'));
        }
        
        const userData = await userService.register({
            email, 
            password, 
            role,
            name,
            lastname,
            birthdate});

        res.cookie('refreshToken', userData.refreshToken, {
            httpOnly: true,
            sameSite: "None",
            domain: process.env.NODE_ENV === 'development' 
                ? 'localhost' : 'onrender.com',
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, //30days
        });

        return res.json(userData);

        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }
    
    async login(req, res, next) {
        try {
            const {email, password} = req.body;

            if(!email || !password) {
                return next(ApiError.internal('Некорректный email или пароль!'));
            }

            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            domain: process.env.NODE_ENV === 'development' 
                ? 'localhost' : 'onrender.com',
            maxAge: 30 * 24 * 60 * 60 * 1000, //30days,
            });

            return res.json(userData);

            } catch(err) {
                console.log(err);
                next(ApiError.internal(err.message));
            }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const deleted = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');

            return res.json({message: `Удалено: ${deleted}`});
        } catch (err) {
             next(ApiError.internal(err.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await userService.getAllUsers();

            return res.json({users});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            if(!refreshToken) {
                return next(ApiError.unauthorized());
            }
            
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                domain: process.env.NODE_ENV === 'development' 
                ? 'localhost' : 'onrender.com',
                maxAge: 30 * 24 * 60 * 60 * 1000, //30days
            });

            return res.json(userData);
        } catch(err) {
            next(ApiError.unauthorized());
        }
        
    }

    async deleteUser(req, res, next) {
        try {
            const id = req.params.id;
            if(!id) {
                return next(ApiError.badRequest());
            }
            const deleted = await userService.deleteUser(id);

            return res.json(deleted);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateCard(req, res, next) {
        try {
            const id = req.user.id;
            const {points} = req.body;
            if(!id || !points) {
                return next(ApiError.badRequest());
            }
            const updated =  await userService.updateUserCard(id, points); 
            return res.json(updated);  
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new UserController();