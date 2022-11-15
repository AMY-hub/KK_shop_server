const Router = require('express');
const basketController = require('../controllers/basketController');
const authCheck = require('../middleware/authCheck');

const router = new Router();

router.post('/item', basketController.addProduct);
router.delete('/item/:id', basketController.deleteProduct);
router.delete('/item', basketController.clearBasket);
router.put('/item/:id', basketController.updateProduct);
router.get('/', basketController.getBasket);

module.exports = router;