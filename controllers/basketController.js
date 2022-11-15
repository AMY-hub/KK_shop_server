const ApiError = require('../error/apiError');
const basketService = require('../services/basketService');
const tokenService = require('../services/tokenService');

class BasketController {
    async getBasket(req, res, next) {
        try {
            const authUser = tokenService.checkAuthFromHeader(req.headers.authorization);
            const {temporaryBasketKey} = req.cookies;

            const  basket = await basketService.getBasket({
                userId: authUser?.id || null,
                key: temporaryBasketKey
            });  

            return res.json(basket);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async addProduct(req, res, next) {
        try {
            const productId = req.body.productId;
             if(!productId) {
                next(ApiError.badRequest());
            }

            const authUser = tokenService.checkAuthFromHeader(req.headers.authorization);
            const {temporaryBasketKey} = req.cookies;

            const {newBasketItem, key} = await basketService.addProduct({
                userId: authUser?.id || null,
                key: temporaryBasketKey,
                productId
            });
            
            if(key) {
                res.cookie('temporaryBasketKey', key, {
                maxAge: 7 * 24 * 60 * 60 * 1000, //7days
            });
            }

            return res.json(newBasketItem);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateProduct(req, res, next) {
        try {
            const id = req.params.id;
            const {amount} = req.body;

            if(!id || !amount) {
                next(ApiError.badRequest());
            }
            const product = await basketService.updateProduct(id, amount);

            return res.json(product);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const id = req.params.id;
           
            if(!id) {
                next(ApiError.badRequest());
            }
            const deleted = await basketService.deleteProduct(id);

            return res.json(deleted);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async clearBasket(req, res, next) {
        try {
            const userId = req.user.id;
            if(!userId) {
                return next(ApiError.unauthorized());
            }
            await basketService.clearBasket(userId);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new BasketController();