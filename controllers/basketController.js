const ApiError = require('../error/apiError');
const basketService = require('../services/basketService/basketService');
const tokenService = require('../services/tokenService');

class BasketController {
    async getBasket(req, res, next) {
        try {
            const authUser = tokenService.checkAuthFromHeader(req.headers.authorization);
            const {temporaryBasketKey} = req.cookies;

            if(!authUser && !temporaryBasketKey) {
                return res.json(null);
            }
            const basket = await basketService.getBasket({
                userId: authUser?.id || null,
                key: temporaryBasketKey 
            });  

            return res.json(basket);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async addItem(req, res, next) {
        try {
            const {itemId, type} = req.body;
             if(!itemId || !type) {
                next(ApiError.badRequest());
            }
            const authUser = tokenService.checkAuthFromHeader(req.headers.authorization);
            const {temporaryBasketKey} = req.cookies;

            const {newBasketItem, key} = await basketService.addItem({
                userId: authUser?.id || null,
                key: temporaryBasketKey,
                itemId,
                type
            });  
     
            if(key) {
                res.cookie('temporaryBasketKey', key, {
                domain: process.env.NODE_ENV === 'production' 
                ? '.kkshop.site' : 'localhost',
                maxAge: 5 * 24 * 60 * 60 * 1000, //5days
            });
            }

            return res.json(newBasketItem);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateItem(req, res, next) {
        try {
            const id = req.params.id;
            const type = req.params.type;
            const {amount} = req.body;

            if(!id || !type || !amount) {
                next(ApiError.badRequest());
            }
            const item = await basketService.updateItem(id, amount, type);

            return res.json(item);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteItem(req, res, next) {
        try {
            const id = req.params.id;
            const type = req.params.type;
           
            if(!id || !type) {
                next(ApiError.badRequest());
            }
            const deleted = await basketService.deleteItem(id, type);

            return res.json(deleted);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteBasket(req, res, next) {
        try {
            const id = req.params.id;
            if(!id) {
                return next(ApiError.badRequest());
            }
            const deleted = await basketService.deleteBasket(id);
            return res.json(deleted);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new BasketController();