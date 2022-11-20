const crypto = require('crypto');
const nodeCron = require('node-cron');
const { Op } = require("sequelize");
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
    SpecialSale } = require('../models/models');

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
                include: [{model: BasketProduct, as: 'products', include: [
                            {model: Product, as: 'product', include: [
                            {model: ProductInfo, as: 'info'},
                            {model: ProductAddImage, as: 'product_add_images'},
                            {model: Review, as: 'reviews'} ,
                            { model: Category },
                            { model: SubCategory },
                            { model: Country },
                            { model: Brand, include: [{model: SpecialSale}]}]                        
                            }]}
                ]
            });

        return basket.getDataValue('products');
    }

    async createTemporaryBasket () {
        const key = crypto.randomUUID();
        const basket = await Basket.create({
               temporary_key: key
            });

        return basket;
    }

    async addProduct({userId, productId, key}) {
        let basket;

        if(userId) {
            basket = await Basket.findOne({ where: {userId} }); 
        }
        if(!userId && key) {
            basket = await Basket.findOne({ where: {temporary_key: key} }); 
        }
        if(!userId && !key) {
            basket = await this.createTemporaryBasket()
        }

        const existingProduct = await BasketProduct.findOne({ 
            where: {productId, basketId: basket.id}
        } );

        if(existingProduct) {
            const newBasketItem = await this.updateProduct(existingProduct.id, existingProduct.amount + 1);  
            return ({newBasketItem, key: basket.getDataValue('temporary_key')});   
        }

        const product = await Product.findOne({ where: {id: productId} });
    
        if(!basket || !product) {
            throw ApiError.internal('Некорректные данные!');
        }

        const basketItem = await BasketProduct.create({
            basketId: basket.id,
            productId
        });
    
        const newBasketItem = await this.getBasketProduct(basketItem.id);
        return ({newBasketItem, key: basket.getDataValue('temporary_key')});
    }

    async updateProduct(id, amount) {
        await BasketProduct.update({ amount }, {where: {id}});
        const newBasketItem = await this.getBasketProduct(id);
        return newBasketItem;
    }

    async deleteProduct(id) {
        const deleted = await BasketProduct.destroy({
            where: {id}
        });

        return deleted;
    }

    async getBasketProduct(id) {
        const product = await BasketProduct.findOne({ 
            where: {id},
            include: [{ model: Product, as: 'product', include: [
                            {model: ProductInfo, as: 'info'},
                            {model: ProductAddImage, as: 'product_add_images'},
                            {model: Review, as: 'reviews'} ,
                            { model: Category },
                            { model: SubCategory },
                            { model: Country },
                            { model: Brand, include: [{model: SpecialSale}]}]                        
                            }]
        });
        return product;
    }

    async clearBasket(userId) {
        const basket = await Basket.findOne({
            where: {userId},  
        }); 
            
        if(!basket) {
            throw ApiError.internal('Некорректные данные!');
        }
        const deleted = await BasketProduct.destroy({
            where: {basketId: basket.id}
        });

        return deleted;
    }
}

module.exports = new BasketService();