const Router = require('express');
const productController = require('../controllers/productController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', authCheck, roleCheck, productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getProduct);
router.delete('/:id',authCheck, roleCheck, productController.deleteProduct);

module.exports = router;