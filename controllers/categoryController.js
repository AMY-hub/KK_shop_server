const { Category, SubCategory } = require('../models/models');


class CategoryController {

    async getAll(req, res) {
        try {
            const categories = await Category.findAll({
                include: [{model: SubCategory, as: 'subcategories'}]
            });
            return res.json({categories});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const id = req.path.split('/')[1];
            const deleted = await Category.destroy({
                where: {id},
                include: [{model: SubCategory, as: 'subcategories'}]
            });
            return res.json({message: `Успешно удален ${deleted}`});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async create(req, res) {
        try {
            const {name, subcategory} = req.body;
            const category = await Category.create({name});
            if(subcategory) {
                subcategory.forEach(el => {
                    SubCategory.create({
                        name: el.name,
                        categoryId: category.id
                    })
                })
            }

            return res.json({category});            
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }
};

module.exports = new CategoryController();