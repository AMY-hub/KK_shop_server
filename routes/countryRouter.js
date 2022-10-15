const Router = require('express');
const countryController = require('../controllers/countryController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', authCheck, roleCheck, countryController.create);
router.delete('/:id', authCheck, roleCheck, countryController.delete);
router.get('/', countryController.getAll);

module.exports = router;