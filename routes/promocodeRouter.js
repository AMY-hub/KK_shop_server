const Router = require('express');
const promocodeController = require('../controllers/promocodeController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', authCheck, roleCheck, promocodeController.create);
router.post('/code', promocodeController.getPromoCode);
router.delete('/:id', authCheck, roleCheck, promocodeController.delete);
router.get('/', authCheck, roleCheck, promocodeController.getAll);

module.exports = router;