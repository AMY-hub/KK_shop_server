const Router = require('express');

const router = new Router();

const productRouter = require('./productRouter');
const userRouter = require('./userRouter');
const brandRouter = require('./brandRouter');
const categoryRouter = require('./categoryRouter');
const countryRouter = require('./countryRouter');
const subscriberRouter = require('./subscriberRourer');
const saleRouter = require('./saleRouter');
const basketRouter = require('./basketRouter');
const favRouter = require('./favRouter');
const certificateRouter = require('./certificateRouter');
const promocodeRouter = require('./promocodeRouter');

router.use('/user', userRouter );
router.use('/basket', basketRouter );
router.use('/fav', favRouter );
router.use('/brand', brandRouter);
router.use('/country', countryRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/subscriber', subscriberRouter);
router.use('/sale', saleRouter);
router.use('/certificate', certificateRouter);
router.use('/promocode', promocodeRouter);

module.exports = router;