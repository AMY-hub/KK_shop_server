const crypto = require('crypto');
const { 
    Order, 
    OrderProduct, 
    Product } = require('../models/models');

class OrderService {

    async createOrder({
        userId, 
        phone, 
        email, 
        address, 
        shipping_method, 
        payment, 
        products}) {

        const newOrder = await Order.create({
            userId: userId || null,
            phone,
            email,
            address,
            shipping_method,
            payment
        });

        products.forEach(async (p) => {
            const product = await Product.findOne({ where: {id: p.id} });
            if(!product) {
                throw ApiError.internal('Некорректные данные!');
            }
            OrderProduct.create({
                amount: p.amount, 
                orderId: newOrder.id,
                productId: p.id
            });
        });

        return newOrder;
    }

    async updateStatus(id, status) {
        const updated = await Order.update({ status }, {where: {id}});
        return updated;
    }

    async updatePaymentStatus(id, status) {
        const updated = await Order.update({ payment_status: status }, {where: {id}});
        return updated;
    }

    async deleteOrder(id) {
        const deleted = await Order.destroy({
            where: {id}
        });

        return deleted;
    }

    async getAllOrders(userId) {
        const orders = await Order.findAll({
            where: {userId}, 
            include: [{
                model: OrderProduct, as: 'products', 
            include: [ {model: Product, as: 'product'}]
            }] 
        }); 
        if(!orders) {
            throw ApiError.internal('Некорректные данные!');
        }

        return orders;
    }

    async getOrder(id) {
        const product = await BasketProduct.findOne({ 
            where: {id},
            include: [{
                model: OrderProduct, as: 'products', 
            include: [ {model: Product, as: 'product'}]
            }] 
        });

        return product;
    }
}

module.exports = new OrderService();