const crypto = require('crypto')
const path = require('path');
const ApiError = require('../error/apiError');
const { Product, ProductInfo, Review, ProductAddImage } = require('../models/models');

class ProductController {

    async getAll(req, res, next) {
        try{
            const {brandId, categoryId, subCategoryId, limit, page} = req.query;
            const currentLimit = limit || 10;
            const currentPage = page || 1;
            const offset = currentPage * currentLimit - currentLimit;

            let products;

            if(!brandId && !categoryId ) {
                products = await Product.findAndCountAll({limit, offset});
            }
            if(brandId && !categoryId) {
                products = await Product.findAndCountAll({where: {brandId}, limit, offset});
            }
            if(!brandId && categoryId && !subCategoryId) {
                products = await Product.findAndCountAll({where: {categoryId}, limit, offset});
            }
            if(!brandId && categoryId && subCategoryId) {
                products = await Product.findAndCountAll({where: {categoryId, subCategoryId}, limit, offset});
            }
            if(brandId && categoryId && !subCategoryId) {
                products = await Product.findAndCountAll({where: {brandId, categoryId}, limit, offset});
            }
            if(brandId && categoryId && subCategoryId) {
                products = await Product.findAndCountAll({where: {brandId, categoryId, subCategoryId}, limit, offset});
            }
            return res.json({products}); 

        } catch(err) {
            next(ApiError.badRequest(err.message));
        }

    }

    async deleteProduct(req, res, next) {
        try {
            const id = req.path.split('/')[1];
            const deleted = await Product.destroy({
                where: {id},
                include: [
                    {model: ProductInfo, as: 'info'},
                    {model: ProductAddImage, as: 'product_add_images'},
                    {model: Review, as: 'reviews'} 
            ]
            });
            return res.json({message: `Успешно удален ${deleted}`});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getProduct(req, res, next) {
        try {
             const id = req.path.split('/')[1];
            const product = await Product.findOne({
                where: {id},
                include: [
                    {model: ProductInfo, as: 'info'},
                    {model: ProductAddImage, as: 'product_add_images'},
                    {model: Review, as: 'reviews'} 
            ]
            });
            return res.json({product});
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const {name, 
                name_rus, 
                price, 
                old_price, 
                weight, 
                volume,
                countryId,
                brandId,
                categoryId,
                subCategoryId,
                info} = req.body;
            
            const {img} = req.files;
            const {product_add_images} = req.files;

            const fileName = crypto.randomUUID() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const product = await Product.create({
                name, 
                name_rus, 
                price, 
                old_price, 
                weight, 
                volume,
                countryId,
                brandId,
                categoryId,
                subCategoryId,
                img: fileName
            }); 

            if(product_add_images) {
                product_add_images.forEach(img => {
                    const addFileName = crypto.randomUUID() + '.jpg';
                    img.mv(path.resolve(__dirname, '..', 'static', addFileName));
                    ProductAddImage.create({
                        img: addFileName,
                        productId: product.id
                    })
                });
            }

            if(info) {
                JSON.parse(info).forEach(el => {
                    ProductInfo.create({
                        title: el.title,
                        description: el.description,
                        productId: product.id
                    })
                });
            }

           return res.json({product});
           
        } catch(err) {
            next(ApiError.badRequest(err.message));
        }

    }
};

module.exports = new ProductController();