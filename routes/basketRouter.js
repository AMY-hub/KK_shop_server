const Router = require('express');
const basketController = require('../controllers/basketController');

const router = new Router();

router.post('/item', basketController.addItem);
router.delete('/item/:type/:id', basketController.deleteItem);
router.delete('/:id', basketController.deleteBasket);
router.put('/item/:type/:id', basketController.updateItem);
router.get('/', basketController.getBasket);

module.exports = router;