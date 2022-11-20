const Router = require('express');
const orderController = require('../controllers/orderController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', orderController.createOrder);
router.put('/order/:id', orderController.updateStatus);
router.delete('/order/:id', authCheck, roleCheck, orderController.deleteOrder);
router.get('/',authCheck, orderController.getAllOrders);
router.get('/:id', authCheck, orderController.getOrder);

module.exports = router;