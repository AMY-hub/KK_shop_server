const crypto = require('crypto');
const nodeCron = require('node-cron');
const { Op } = require("sequelize");
const ApiError = require('../../error/apiError');
const basketCertificateService = require('./basketCertificateService');
const basketProductService = require('./basketProductService');
const { 
    Basket, 
    BasketProduct, 
    Product,
    ProductInfo,
    ProductAddImage,
    Review,
    Category,
    SubCategory,
    Country,
    Brand,
    SpecialSale, 
    Certificate,
    BasketCertificate} = require('../../models/models');

//Delete the basket of unregistered users without updates every 5 days: 
nodeCron.schedule("1 * * * *", () => {
    Basket.destroy({where: {
        [Op.and]: [
            {updatedAt: {[Op.lte]: new Date(Date.now() - (1000 * 60 * 60 * 24 * 5))}},
            {userId: null}
        ]
    }})
});

class BasketService {

    async getBasket ({userId, key}) {
        const basket = await Basket.findOne({
                where: userId ? {userId} : {temporary_key: key},
                include: [
                    {model: BasketProduct, as: 'products', include: [
                            {model: Product, as: 'product', include: [
                            {model: ProductInfo, as: 'info'},
                            {model: ProductAddImage, as: 'product_add_images'},
                            {model: Review, as: 'reviews'} ,
                            { model: Category },
                            { model: SubCategory },
                            { model: Country },
                            { model: Brand, include: [{model: SpecialSale}]}]                        
                    }]},
                    {model: BasketCertificate, as: 'certificates', include: [
                        {model: Certificate, as: 'certificate'}
                    ]}
                ]
            });

        return [...basket.getDataValue('products'), ...basket.getDataValue('certificates')];
    }

    async createTemporaryBasket () {
        const key = crypto.randomUUID();
        const basket = await Basket.create({
               temporary_key: key
            });

        return basket;
    }

    async findOrCreateBasket(userId, key) {
        let basket;

        if(userId) {
            basket = await Basket.findOne({ where: {userId} }); 
        }
        if(!userId && key) {
            basket = await Basket.findOne({ where: {temporary_key: key} }); 
        }
        if((!userId && !key) || !basket) {
            basket = await this.createTemporaryBasket()
        }
        return basket;
    }

    async addItem({userId, itemId, type, key}) {
        const basket = await this.findOrCreateBasket(userId, key);
        if(!basket) {
            throw ApiError.internal('Некорректные данные!');
        }

        if(type === 'certificate') {
           const newBasketItem = await basketCertificateService
           .addCertificate(basket.id, itemId)
            return ({newBasketItem, key: basket.getDataValue('temporary_key')});  
        }

        if(type === 'product') {
           const newBasketItem = await basketProductService
           .addProduct(basket.id, itemId);

            return ({newBasketItem, key: basket.getDataValue('temporary_key')});  
        }

        return null;
    }

    async updateItem(id, amount, type) {
        if(type === 'certificate') {
           return await basketCertificateService
            .updateItem(id, amount);
        }
        if(type === 'product') {
            return await basketProductService
            .updateProduct(id, amount);
        }
        return null;
    }

    async deleteItem(id, type) {
        let deleted = 0;
        if(type === 'certificate') {
            deleted = await basketCertificateService.deleteItem(id);
        }
        if(type === 'product') {
            deleted = await basketProductService.deleteProduct(id);
        }

        return deleted;
    }

    async deleteBasket(id) {
        const basket = await Basket.findOne({
            where: {id},  
        }); 
        if(!basket) {
            throw ApiError.internal('Некорректные данные!');
        }
        if(basket.userId) {
            const deleted = await BasketProduct.destroy({
                where: {basketId: id}
            });
            const deletedCertificates = await BasketCertificate.destroy({
                where: {basketId: id}
            });
            return deleted + deletedCertificates;
        }
        const deleted = await Basket.destroy({ 
            where: {temporary_key: basket.temporary_key} 
        });
        return deleted;
    }
}

module.exports = new BasketService();