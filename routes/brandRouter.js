const Router = require('express');
const brandController = require('../controllers/brandController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', authCheck, roleCheck, brandController.create);
router.delete('/:id', authCheck, roleCheck, brandController.delete);
router.get('/', brandController.getAll);

module.exports = router;