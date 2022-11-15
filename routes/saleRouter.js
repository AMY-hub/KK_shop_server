const Router = require('express');
const saleController = require('../controllers/saleController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', authCheck, roleCheck, saleController.createSale);
router.delete('/:id', authCheck, roleCheck, saleController.deleteSale);
router.get('/:id', saleController.getSale);
router.get('/', saleController.getAll);

module.exports = router;