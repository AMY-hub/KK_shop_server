const crypto = require('crypto');
const path = require('path');
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
        const {
            brandId, 
            categoryId, 
            subCategoryId, 
            limit, 
            page, 
            sort, 
            order
        } = filterParams;

        const currentLimit = limit || 10;
        const currentPage = page || 1;
        const offset = currentPage * currentLimit - currentLimit;

        let filter = {};
        if(brandId) {
            filter.brandId = brandId;
        }
        if(categoryId) {
            filter.categoryId = categoryId;
        }
        if(subCategoryId) {
            filter.subCategoryId = subCategoryId;
        }

        let sortParams = ['id', 'ASC'];
        if(sort && order) {
            sortParams[0] = sort;
            sortParams[1] = order;
        }
        if(sort && !order) {
            sortParams[0] = sort;
        }

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
};

module.exports = new ProductService();