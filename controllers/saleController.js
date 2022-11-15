const { SpecialSale, Brand } = require('../models/models');
const ApiError = require('../error/apiError');

class SaleController {
    async getSale(req, res, next) {
        const id = req.params.id;
        try {
            const sale = await SpecialSale.findOne({
                where: {id},
                include: [{model: Brand, as: 'brands'}]
            });
            return res.json({sale});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const sales = await SpecialSale.findAll({
                include: [{model: Brand, as: 'brands'}]
            });
            return res.json({sales});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteSale(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await SpecialSale.destroy({ where: {id} });

            return res.json({message: `Удалено: ${deleted}`});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async createSale(req, res, next) {
        try {
            const {name, discount, brands} = req.body;
            const sale = await SpecialSale.create({name, discount});
            if(brands) {
                brands.forEach(el => {
                    Brand.update({specialSaleId: sale.id}, {
                        where: {
                            name: el
                        }
                    });
                });
            }

            return res.json({sale});            
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new SaleController();