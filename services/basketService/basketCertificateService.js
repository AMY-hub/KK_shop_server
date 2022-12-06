const ApiError = require('../../error/apiError');
const {
    Certificate,
    BasketCertificate} = require('../../models/models');

class BasketCertificateService {

    async addCertificate(basketId, certificateId) {
        const existingItem = await BasketCertificate.findOne({ 
            where: {certificateId, basketId}
        } );

        if(existingItem) {
            const newBasketItem = await this
            .updateItem(existingItem.id, existingItem.amount + 1);  
            return newBasketItem;   
        }
        const certificate = await Certificate.findOne({ where: {id: certificateId} });

        if(!certificate) {
            throw ApiError.internal('Некорректные данные!');
        }

        const basketCertificate = await BasketCertificate.create({
            basketId,
            certificateId
        });
    
        const newBasketItem = await this
        .getBasketItem(basketCertificate.id);
        return newBasketItem;
    }

    async updateItem(id, amount) {
        await BasketCertificate.update({ amount }, {where: {id}});
        const newBasketItem = await this.getBasketItem(id);
        return newBasketItem;
    }

    async deleteItem(id) {
        const deleted = await BasketCertificate.destroy({
            where: {id}
        });
        return deleted;
    }

    async getBasketItem(id) {
        const product = await BasketCertificate.findOne({ 
            where: {id},
            include: [{ model: Certificate, as: 'certificate'}]
        });
        return product;
    }
}

module.exports = new BasketCertificateService();