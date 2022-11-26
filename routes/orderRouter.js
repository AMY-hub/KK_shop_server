const Router = require('express');
const orderController = require('../controllers/orderController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', orderController.createOrder);
router.get('/', authCheck, orderController.getAllOrders);
router.get('/:id', authCheck, orderController.getOrder);
router.put('/:id', orderController.updateStatus);
router.delete('/:id', authCheck, roleCheck, orderController.deleteOrder);

module.exports = router;