const { 
    FavList, 
    FavProduct, 
    Product,
    ProductInfo,
    ProductAddImage,
    Review,
    Category,
    SubCategory,
    Country,
    Brand,
    SpecialSale } = require('../models/models');

class FavService {

    async getFavList (userId) {
        const favList = await FavList.findOne({
                where: {userId},
                include: [
                    {model: FavProduct, as: 'favs', include: [{
                        model: Product, as: 'product', include: [
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

        return favList.getDataValue('favs');
    }

    async addProduct(userId, productId) {
        const favList = await FavList.findOne({ 
            where: {userId}, 
            include: [ {model: FavProduct, as: 'favs'}]
         }); 
        
        const existingProduct = favList.favs.find( el => el.productId === productId);

        console.log('EXISTING PRODUUCT',existingProduct);

        if(existingProduct) {
            const favProduct = await this.getFavProduct(existingProduct.id);
            return favProduct;
        }

        const product = await Product.findOne({ where: {id: productId} });
        
        if(!favList || !product) {
            throw ApiError.internal('Некорректные данные!');
        }
        const fav = await FavProduct.create({
            favListId: favList.id,
            productId
        });
        const favProduct = await this.getFavProduct(fav.id);

        return favProduct;
    }

    async deleteProduct(id) {
        const deleted = await FavProduct.destroy({ where: {id} });

        return deleted;
    }

    async getFavProduct(id) {
    const product = await FavProduct.findOne({ 
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

module.exports = new FavService();