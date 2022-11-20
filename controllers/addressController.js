const ApiError = require('../error/apiError');
const { ShopAddress } = require('../models/models');

class AddressController {

    async getAll(req, res, next) {
        try {
            const addresses = await ShopAddress.findAll();
            return res.json(addresses);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const {type, address, email, phone, coord} = req.body;
console.log('COORD', coord);
            const newAddress = await ShopAddress.create({
                type,
                address,
                email,
                phone,
                coord
            });
            return res.json(newAddress);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await ShopAddress.destroy({ where: {id} });
            
            return res.json(deleted);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new AddressController();