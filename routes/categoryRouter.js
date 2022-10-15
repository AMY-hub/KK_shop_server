const Router = require('express');
const categoryController = require('../controllers/categoryController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', authCheck, roleCheck, categoryController.create);
router.delete('/:id', authCheck, roleCheck, categoryController.deleteCategory);
router.get('/', categoryController.getAll);

module.exports = router;