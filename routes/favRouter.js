const Router = require('express');
const favController = require('../controllers/favController');
const authCheck = require('../middleware/authCheck');

const router = new Router();

router.post('/item', authCheck, favController.addProduct);
router.delete('/item/:id', authCheck, favController.deleteProduct);
router.get('/', authCheck, favController.getFavList);

module.exports = router;