const crypto = require('crypto');
const ApiError = require('../error/apiError');
const { YooCheckout } = require('@a2seven/yoo-checkout');
require('dotenv').config();

class PaymentService {
    constructor() {
        this.checkout = new YooCheckout({ 
            shopId: process.env.YOOKASSA_SHOP, 
            secretKey: process.env.YOOKASSA_KEY 
        });
    }

    async createPayment(price, key) {

        const idempotenceKey = crypto.randomUUID();

        const createPayload = {
            amount: {
                value: price,
                currency: 'RUB'
            },
            payment_method_data: {
                type: 'bank_card'
            },
            capture: true,
            confirmation: {
                type: 'redirect',
                return_url: process.env.NODE_ENV === "production" ?
                'https://app.kkshop.site' : 'http://localhost:3000'
            }, 
            metadata: {
                key
            }
        };

        try {
            const payment = await this.checkout.createPayment(createPayload, idempotenceKey);
            if(payment.type && payment?.type === "error") {
                throw ApiError.internal(`Ошибка платежа: ${payment?.code}! Повторите отправку заказа либо обратитесь в поддержку.`);
            }
            return payment;
        } catch (error) {
            console.error(error);
            throw ApiError.internal('Ошибка платежа! Повторите отправку заказа либо обратитесь в поддержку.');
        }
    }

    async getPaymentInfo(paymentId) {
        try {
            const payment = await this.checkout.getPayment(paymentId);
            return payment;
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = new PaymentService();