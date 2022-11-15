const ApiError = require('../error/apiError');
const favService = require('../services/favService');

class FavController {
    async getFavList(req, res, next) {
        try {
            const userId = req.user.id;
            const favList = await favService.getFavList(userId);

            return res.json(favList);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

        async addProduct(req, res, next) {
        try {
            const userId = req.user.id;
            const{ productId} = req.body;
            const favProduct = await favService.addProduct(userId, productId);

            return res.json(favProduct);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const userId = req.user.id;
            const id = req.params.id;
           
            if(!id) {
                next(ApiError.internal('Некорректные данные!'));
            }
            const deleted = await favService.deleteProduct(id);

            return res.json(deleted);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new FavController();