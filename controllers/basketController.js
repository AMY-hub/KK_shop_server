const ApiError = require('../error/apiError');
const { Basket, BasketProduct } = require('../models/models');

class BasketController {
    async getBasket(req, res) {
        try {
            const userId = req.user.id;
            const basket = await Basket.findOne({
                where: {userId},
                include: [
                    {model: BasketProduct, as: 'products'}
                ]
            });
            return res.json({basket});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async addProduct(req, res) {
        try {
            const userId = req.user.id;
            const basket = await Basket.findOne({
                where: {userId},  
            }); 
            const productId = req.body;
            if(!basket || !productId) {
                next(ApiError.internal('Некорректные данные!'));
            }
            const basketProduct = await BasketProduct.create({
                userId,
                basketId: basket.id,
                productId
            });

            const newBasket = await Basket.findOne({
                where: {userId},
                include: [
                    {model: BasketProduct, as: 'products'}
                ]
            });
            return res.json({basket: newBasket});
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new BasketController();