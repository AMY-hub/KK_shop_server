const ApiError = require('../error/apiError');
const orderService = require('../services/orderService');

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
            const {status, payment_status} = req.body;
            if(status) {
                await orderService.updateStatus(id, status);
            }
            if(payment_status) {
                await orderService.updatePaymentStatus(id, payment_status);
            }
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
                shipping_method, 
                payment,
                products} = req.body;

            if(!phone 
                || !email 
                || !address 
                || !shipping_method 
                || !payment 
                || !products 
                || products.length === 0) {
                return next(ApiError.badRequest());
            }

            const newOrder = await orderService.createOrder({
                userId,
                phone, 
                email, 
                address, 
                shipping_method, 
                payment,
                products
            });
            
            return res.json(newOrder);
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