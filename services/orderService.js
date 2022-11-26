const { 
    Order, 
    OrderProduct, 
    Product, 
    User,
    BonusCard} = require('../models/models');

class OrderService {

    async createOrder({
        userId, 
        phone, 
        email, 
        address, 
        delivery, 
        payment, 
        products,
        price,
        delivery_price,
        bonus_discount}) {

        const key = Math.round(parseInt(phone) + Date.now() / 10);
        let user;
        let newBonusPoints;
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

        return {orderNumber: newOrder.getDataValue('key'), points: newBonusPoints};
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

    async updatePaymentStatus(id, status) {
        const updated = await Order.update({ payment_status: status }, {where: {id}});
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
            }], 
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
            }] 
        });

        return product;
    }
}

module.exports = new OrderService();