const Router = require('express');

const router = new Router();

const productRouter = require('./productRouter');
const userRouter = require('./userRouter');
const brandRouter = require('./brandRouter');
const categoryRouter = require('./categoryRouter');
const countryRouter = require('./countryRouter');

router.use('/user', userRouter );
router.use('/brand', brandRouter);
router.use('/country', countryRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);

module.exports = router;