const ApiError = require('../error/apiError');
const { FavList, FavProduct } = require('../models/models');

class FavController {
    async getFavList(req, res) {
        try {
            const userId = req.user.id;
            const favList = await FavList.findOne({
                where: {userId},
                include: [
                    {model: FavProduct, as: 'products'}
                ]
            });
            return res.json({favList});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async addProduct(req, res) {
        try {
            const userId = req.user.id;
            const favList = await FavList.findOne({
                where: {userId},  
            }); 
            const productId = req.body;
            if(!favList || !productId) {
                next(ApiError.internal('Некорректные данные!'));
            }
            const favProduct = await FavProduct.create({
                userId,
                favListId: favList.id,
                productId
            });

            const newFavList = await favList.findOne({
                where: {userId},
                include: [
                    {model: FavProduct, as: 'products'}
                ]
            });
            return res.json({favList: newFavList});
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new FavController();