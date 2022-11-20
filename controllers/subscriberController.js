const { Subscriber } = require('../models/models');
const ApiError = require('../error/apiError');

class SubscriberController {

    async getAll(req, res, next) {
        try {
            const subscribers = await Subscriber.findAll();
            
            return res.json({subscribers});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteSubscriber(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await Subscriber.destroy({ where: {id} });

            return res.json(deleted);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async createSubscriber(req, res, next) {
        try {
            const {email} = req.body;
            const emailExists = await Subscriber.findOne({where: {email}});
            if(emailExists) {
            return next(ApiError.internal('email уже зарегистрирован!'));
            }
            const subscriber = await Subscriber.create({email});
            return res.json({subscriber});            
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }
};

module.exports = new SubscriberController();