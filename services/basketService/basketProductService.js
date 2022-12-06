const ApiError = require('../../error/apiError');
const { 
    BasketProduct, 
    Product,
    ProductInfo,
    ProductAddImage,
    Review,
    Category,
    SubCategory,
    Country,
    Brand,
    SpecialSale} = require('../../models/models');

class BasketProductService {

    async addProduct(basketId, productId) {
        const existingProduct = await BasketProduct.findOne({ 
            where: {productId, basketId}
        } );

        if(existingProduct) {
            const newBasketItem = await this
            .updateProduct(existingProduct.id, existingProduct.amount + 1); 
            return newBasketItem;
        }

        const product = await Product.findOne({ where: {id: productId} });
        if(!product) {
            throw ApiError.internal('Некорректные данные!');
        }

        const basketItem = await BasketProduct.create({
            basketId,
            productId
        });
    
        const newBasketItem = await this
        .getBasketProduct(basketItem.id);
        return newBasketItem;
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
}

module.exports = new BasketProductService();