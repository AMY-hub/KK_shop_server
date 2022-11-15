const { Category, SubCategory } = require('../models/models');
const ApiError = require('../error/apiError');

class CategoryController {

    async getAll(req, res, next) {
        try {
            const categories = await Category.findAll({
                include: [{model: SubCategory, as: 'subcategories'}],
                order: [['name', 'ASC']]
            });
            return res.json({categories});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await Category.destroy({ where: {id} });

            return res.json({message: `Удалено: ${deleted}`});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const {name, route, subcategory} = req.body;
            const category = await Category.create({name, route});
            if(subcategory) {
                subcategory.forEach(el => {
                    SubCategory.create({
                        name: el.name,
                        route: el.route,
                        categoryId: category.id
                    })
                })
            }

            return res.json({category});            
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new CategoryController();