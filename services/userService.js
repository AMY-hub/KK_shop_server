const bcrypt = require('bcrypt');
const ApiError = require('../error/apiError');
const { 
    User, 
    Basket, 
    FavList, 
    BonusCard } = require('../models/models');
const basketService = require('../services/basketService/basketService');
const favService = require('./favService');
const tokenService = require('./tokenService');

class UserService {

    async register(userData) {
        const userExists = await User.findOne({where: {email: userData.email}});
        if(userExists) {
            throw ApiError.internal('Пользователь с таким email уже существует!');
        }
        const hashPassword = await bcrypt.hash(userData.password, 5);
        const cardNumber = Math.trunc(Math.random() * 10000) + Date.now();
        const user = await User.create({...userData, password: hashPassword});
        await Basket.create({userId: user.id});
        await FavList.create({userId: user.id});
        BonusCard.create({userId: user.id, number: cardNumber});
        const tokens = tokenService.createTokens({
            id: user.id,
            email: user.email,
            role: user.role
        });
        await tokenService.saveToken(user.id, tokens.refreshToken);
        
        const fullUserData = await User.findOne({
            where:{id: user.id},
            include: [
                {model: BonusCard, as: 'bonus_card'}
            ]});
        const basket = await basketService.getBasket({userId: user.id});
        const fav_list = await favService.getFavList(user.id);
    
        return {...tokens, user: fullUserData, basket, fav_list};
    }

    async login (email, password) {
        const user = await User.findOne({
            where:{email},
            include: [
                {model: BonusCard, as: 'bonus_card'}
            ]});
            if(!user) {
                throw ApiError.internal('Пользователь с таким email не найден!');
            }
            const passwordsEqual = await bcrypt.compare(password, user.password);
            if(!passwordsEqual) {
                throw ApiError.internal('Указан неверный пароль!');
            }
            const tokens = tokenService.createTokens({
            id: user.id,
            email: user.email,
            role: user.role
            });
            await tokenService.saveToken(user.id, tokens.refreshToken);

            const basket = await basketService.getBasket({userId: user.id});
            const fav_list = await favService.getFavList(user.id);
        
            return {...tokens, user, basket, fav_list};
    }

    async logout (refreshToken) {
        const deleted = await tokenService.deleteToken(refreshToken);
        return deleted;
    }

    async refresh (refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findRefreshToken(refreshToken);
        if(!userData || ! tokenFromDB) {
            throw ApiError.unauthorized();
        }

        const user = await User.findOne({
            where: {id: userData.id},
            include: [
                {model: BonusCard, as: 'bonus_card'}
            ]});

        const tokens = tokenService.createTokens({
            id: user.id,
            email: user.email,
            role: user.role
            });

        await tokenService.saveToken(user.id, tokens.refreshToken);
        const basket = await basketService.getBasket({userId: user.id});
        const fav_list = await favService.getFavList(user.id);
    
        return {...tokens, user, basket, fav_list};
    }
    
    async deleteUser (id) {
        const deleted = await User.destroy({ where: {id} });
        return deleted;
    }

    async getAllUsers () {
        const users = await User.findAll({
                include: [
                {model: BonusCard, as: 'bonus_card'}
            ]});

        return users;
    }

    async updateUserCard(id, points) {
        const updated = await BonusCard.update({ points }, {where: {userId: id}});
        return updated;
    }
};

module.exports = new UserService();