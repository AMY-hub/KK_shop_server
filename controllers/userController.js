const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../error/apiError');
const { User, Basket, FavList, BonusCard, Order } = require('../models/models');

class UserController {
    async registration(req, res, next) {
        try {
            const {
            email, 
            password, 
            role,
            name,
            lastname,
            age,
            skin} = req.body;
        if(!email || !password) {
            return next(ApiError.internal('Некорректный email или пароль!'));
        }
        if(!name) {
            return next(ApiError.internal('Имя не указано!'));
        }
        const userExists = await User.findOne({where: {email}});
        if(userExists) {
            return next(ApiError.internal('Пользователь с таким email уже существует!'));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({email, role, password: hashPassword, name, lastname, age, skin});
        Basket.create({userId: user.id});
        FavList.create({userId: user.id});
        const cardNumber = Math.trunc(Math.random() * 10000) + Date.now(); 
        BonusCard.create({userId: user.id, number: cardNumber});

        const token = UserController.createToken(user.id, user.email, user.role);
        return res.json({token});

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }
    
    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({
            where:{email},
            include: [
                {model: Basket, as: 'basket'},
                {model: FavList, as: 'fav_list'},
                {model: BonusCard, as: 'bonus_card'},
                {model: Order, as: 'orders'}
            ]
            });
            if(!user) {
                return next(ApiError.internal('Пользователь с таким email не найден!'));
            }
            const comparePassword = await bcrypt.compare(password, user.password);
            if(!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль!'));
            }
            const token = UserController.createToken(user.id, user.email, user.role);
            return res.json({token, user});
            } catch(err) {
                next(ApiError.badRequest(err.message));
            }
    }

    async getAll(req, res) {
        try {
            const users = await User.findAll({
                include: [
                {model: Basket, as: 'basket'},
                {model: FavList, as: 'fav_list'},
                {model: BonusCard, as: 'bonus_card'},
                {model: Order, as: 'orders'}
            ]
            });
            return res.json({users});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async auth(req, res, next) {
        try {
            const token =  UserController.createToken(req.user.id, req.user.email, req.user.role);
            return res.json({token});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
        
    }

    async deleteUser(req, res, next) {
        try {
            const id = req.path.split('/')[1];
            const deleted = await User.destroy({
                where: {id},
                include: [
                {model: Basket, as: 'basket'},
                {model: FavList, as: 'fav_list'},
                {model: BonusCard, as: 'bonus_card'},
                {model: Order, as: 'orders'}
            ]
            });
            return res.json({message: `Успешно удален ${deleted}`});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    static createToken = (id, email, role) => {
        return jwt.sign(
            {id, email, role}, 
            process.env.SEKRET_KEY,
            {expiresIn: '24h'}
            );
    }
};

module.exports = new UserController();