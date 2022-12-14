const { 
    Order, 
    OrderProduct, 
    Product, 
    User,
    BonusCard,
    OrderCertificate,
    Certificate} = require('../models/models');
const paymentService = require('./paymentService');

class OrderService {

    async createOrder({
        userId, 
        phone, 
        email, 
        address, 
        delivery, 
        payment, 
        products,
        certificates,
        price,
        delivery_price,
        bonus_discount}) {

        const key = Math.round(parseInt(phone) + Date.now() / 10);

        let onlinePayment;
        let payment_url;
        let user;
        let newBonusPoints;

        if(payment === 'онлайн') {
            onlinePayment = await paymentService.createPayment(price, key);
            payment_url = onlinePayment.confirmation.confirmation_url;
            console.log('NEW PAYMENT', onlinePayment);
        }

        if(userId) {
            user = await User.findOne({where: {id: userId}});
        }
        if(user) {
            newBonusPoints = await this.updateBonusCard(user.id, 'decr', bonus_discount);
        }

        const newOrder = await Order.create({
            userId: user?.id || null,
            key,
            phone,
            email,
            address,
            delivery,
            payment,
            payment_id: onlinePayment ? onlinePayment.id : null,
            payment_confirmation: payment_url || null,
            price,
            delivery_price,
            bonus_discount
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

        if(certificates) {
            certificates.forEach(async (c) => {
            const certificate = await Certificate.findOne({ where: {id: c.id} });
            if(!certificate) {
                throw ApiError.internal('Некорректные данные!');
            }
            OrderCertificate.create({
                amount: c.amount, 
                orderId: newOrder.id,
                certificateId: c.id
            });
        });
        }

        return {
            orderNumber: newOrder.getDataValue('key'), 
            points: newBonusPoints,
            payment_url};
    }

    async updateStatus(id, status) {
        const order = await Order.findOne({where: id});
        if(!order) {
            throw ApiError.internal('Не удалось обновить данные!');
        }
        if(status === 'получен' && order.userId) {
            const bonus = Math.round(order.price * 0.1);
            this.updateBonusCard(order.userId, 'inc', bonus);
        }
        const updated = await Order.update({ status }, {where: {id}});
        return updated;
    }

    async updatePaymentStatus(payment_id, status) {
        const updated = await Order.update({ payment_status: status }, {where: {payment_id}});
        return updated;
    }

    async updateBonusCard(userId, action, value) {
        const card = await BonusCard.findOne({where: {userId}});
        if(!card) {
            throw ApiError.internal('Не удалось обновить данные карты!');
        }
        let points = card.points;
        
        if(action === 'inc') {
            points += value;
        }
        if(action === 'decr') {
            const newPoints = points - value;
            points = newPoints < 0 ? 0 : newPoints
        }

        await BonusCard.update({ points }, {where: {id: card.id}});
        return points;
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
            }, 
            {
                model: OrderCertificate, as: 'certificates',
                include: [ {model: Certificate, as: 'certificate'}]
            }] , 
            order: [['createdAt', 'DESC']] 
        }); 
        if(!orders) {
            throw ApiError.internal('Некорректные данные!');
        }

        return orders;
    }

    async getOrder(id) {
        const product = await Order.findOne({ 
            where: {id},
            include: [{
                model: OrderProduct, as: 'products', 
                include: [ {model: Product, as: 'product'}]
            }, 
            {
                model: OrderCertificate, as: 'certificates',
                include: [ {model: Certificate, as: 'certificate'}]
            }] 
        });

        return product;
    }
}

module.exports = new OrderService();