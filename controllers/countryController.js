const { Country } = require('../models/models');

class CountryController {

    async getAll(req, res) {
        try {
            const countries = await Country.findAll();
            return res.json({countries});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async create(req, res) {
        try {
            const {name} = req.body;
            const country = await Country.create({name});
            return res.json({country});
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.path.split('/')[1];
            const deleted = await Country.destroy({
                where: {id}
            });
            return res.json({message: `Успешно удален ${deleted}`});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new CountryController();