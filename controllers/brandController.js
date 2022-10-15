const ApiError = require('../error/apiError');
const { Brand, Country } = require('../models/models');

class BrandController {

    async getAll(req, res) {
        try {
            const brands = await Brand.findAll();
            return res.json({brands});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const {name, country} = req.body;
            const brandCountry = await Country.findOne({
                where: {name: country}
            });

            if(!brandCountry) {
                return next(ApiError.internal('Страна-производитель отсутствует в базе!'));
            }

            const brand = await Brand.create({
                name,
                countryId: brandCountry.id
            });
            return res.json({brand});
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.path.split('/')[1];
            const deleted = await Brand.destroy({
                where: {id}
            });
            return res.json({message: `Успешно удален ${deleted}`});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new BrandController();