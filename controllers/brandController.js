const ApiError = require('../error/apiError');
const { Brand, Country, SpecialSale } = require('../models/models');

class BrandController {

    async getAll(req, res, next) {
        try {
            const brands = await Brand.findAll({
                include: [
                    {model: SpecialSale},
                    {model: Country}
                ]
            });
            return res.json({brands});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const {name, route, country, description} = req.body;
            const brandCountry = await Country.findOne({
                where: {name: country}
            });

            if(!brandCountry) {
                return next(ApiError.internal('Страна-производитель отсутствует в базе!'));
            }

            const brand = await Brand.create({
                name,
                route,
                description,
                countryId: brandCountry.id,
                specialSaleId: null
            });
            return res.json({brand});
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await Brand.destroy({ where: {id} });
            
            return res.json({message: `Удалено: ${deleted}`});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new BrandController();