const ApiError = require('../error/apiError');
const orderService = require('../services/orderService');
const paymentService = require('../services/paymentService');

class OrderController {

    async getAllOrders(req, res, next) {
        try {
            const userId = req.user.id;
            const orders = await orderService.getAllOrders(userId);

            return res.json(orders);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async getOrder(req, res, next) {
        try {
            const id = req.params.id;
            if(!id) {
                next(ApiError.badRequest());
            }
            const order = await orderService.getOrder(id);

            return res.json(order);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateStatus(req, res, next) {
        try {
            const id = req.params.id;
            if(!id) {
                next(ApiError.badRequest());
            }
            let updated;
            const {status} = req.body;
            if(status) {
                updated = await orderService.updateStatus(id, status);
            }
            return res.json(updated);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async updatePaymentStatus(req, res, next) {
        try {
            const {event, object} = req.body;
            if(!event || !object?.id) {
                next(ApiError.badRequest());
            }
            let updated;
            if(event === 'payment.succeeded' 
            && object.status === "succeeded") {
                updated = await orderService.updatePaymentStatus(object?.id, 'оплачен')
            }
            res.status = 200;
            return res.json(updated);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async createOrder(req, res, next) {
        try {
            const {
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
                bonus_discount} = req.body;

            if(!phone 
                || !email 
                || !address 
                || !delivery
                || !payment 
                || !products 
                || products.length === 0) {
                return next(ApiError.badRequest());
            }

            const orderData = await orderService.createOrder({
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
                bonus_discount
            });
            
            return res.json(orderData);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteOrder(req, res, next) {
        try {
            const id = req.params.id;
            if(!id) {
                next(ApiError.badRequest());
            }
            const deleted = await orderService.deleteOrder(id);

            return res.json(deleted);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

};

module.exports = new OrderController();