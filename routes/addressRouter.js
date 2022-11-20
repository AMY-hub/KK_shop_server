const Router = require('express');
const addressController = require('../controllers/addressController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', authCheck, roleCheck, addressController.create);
router.delete('/:id', authCheck, roleCheck, addressController.delete);
router.get('/', addressController.getAll);

module.exports = router;