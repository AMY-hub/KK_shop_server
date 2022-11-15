const ApiError = require('../error/apiError');
const { PromoCode } = require('../models/models');

class PromoCodeController {

    async getAll(req, res, next) {
        const codes = await PromoCode.findAll();
        return res.json(codes);
    }

    async getPromoCode(req, res, next) {
        const {name} = req.body;
        if(!name) {
            return next(ApiError.badRequest());
        }
        const promo = await PromoCode.findOne({where: {name}})
        return res.json(promo);
    }

    async create(req, res, next) {
        try {
            const {name, discount} = req.body;
            if(!discount || !name) {
                return next(ApiError.internal('Некорректные данные'));
            }
            const promo = await PromoCode.create({name, discount});

            return res.json(promo);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await PromoCode.destroy({ where: {id} });
            
            return res.json(deleted);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new PromoCodeController();