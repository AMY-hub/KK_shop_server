const crypto = require('crypto');
const path = require('path');
const { Op } = require("sequelize");
const { 
    Product, 
    ProductInfo, 
    Review, 
    ProductAddImage, 
    SpecialSale, 
    Brand, 
    Category, 
    SubCategory, 
    Country } = require('../models/models');

class ProductService {

    async getProducts(filterParams) {
        const {limit, page} = filterParams;
        const [filter, sortParams] = this.configureFilter(filterParams);

        const currentLimit = limit || 10;
        const currentPage = page || 1;
        const offset = currentPage * currentLimit - currentLimit;

        const products = await Product.findAndCountAll({
            where: filter, 
            order: [sortParams], 
            limit: limit, 
            offset,
            include: [
                { model: Brand, 
                    include: [{
                    model: SpecialSale
                }]},
                { model: Category },
                { model: SubCategory },
                { model: Country }
            ]
        });

        return products; 
    }

    async deleteProduct(id) {
        const deleted = await Product.destroy({ where: {id} });

        return deleted;
    }

    async getProductById(id) {
        const product = await Product.findOne({
            where: {id},
            include: [
                {model: ProductInfo, as: 'info'},
                {model: ProductAddImage, as: 'product_add_images'},
                {model: Review, as: 'reviews'} ,
                { model: Category },
                { model: SubCategory },
                { model: Country },
                { model: Brand, 
                    include: [{
                    model: SpecialSale
                }]}
        ]
        });

        return product;
    }

    async createProduct(productData, img, addImages) {
            const {
                name, 
                name_rus, 
                price, 
                weight, 
                volume,
                countryId,
                brandId,
                categoryId,
                subCategoryId,
                art,
                info} = productData;

            const fileName = crypto.randomUUID() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const product = await Product.create({
                name, 
                name_rus, 
                price, 
                weight, 
                volume,
                countryId,
                brandId,
                categoryId,
                subCategoryId,
                art,
                img: fileName
            }); 

            if(addImages && Array.isArray(addImages)) {
                addImages.forEach(img => {
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

           return product;
    }

    configureFilter(params) {
        const {
            brandId, 
            categoryId, 
            subCategoryId, 
            sort, 
            order,
            minPrice,
            maxPrice
        } = params;

        let filter = {};
        if(brandId) {
            filter.brandId = {
                    [Op.in]: Array.isArray(brandId) ? brandId : brandId.split(',')
                } 
        }
        if(categoryId) {
            filter.categoryId = categoryId;
        }
        if(subCategoryId) {
            filter.subCategoryId = subCategoryId;
        }
        if(minPrice && maxPrice) {
            filter.price = {
                    [Op.between]: [minPrice, maxPrice]
                } 
        }

        let sortParams = ['id', 'ASC'];
        if(sort) {
            sortParams[0] = sort;
        }
        if(order) {
            sortParams[1] = order;
        }

        return [filter, sortParams];
    }
};

module.exports = new ProductService();