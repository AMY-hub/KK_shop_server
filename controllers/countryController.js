const { Country } = require('../models/models');
const ApiError = require('../error/apiError');

class CountryController {

    async getAll(req, res, next) {
        try {
            const countries = await Country.findAll();
            return res.json({countries});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const {name} = req.body;
            const country = await Country.create({name});
            return res.json({country});
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async delete(req, res,next) {
        try {
            const id = req.params.id;
            const deleted = await Country.destroy({ where: {id} });
            return res.json({message: `Удалено: ${deleted}`});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new CountryController();