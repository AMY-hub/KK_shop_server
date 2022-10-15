const Router = require('express');
const userController = require('../controllers/userController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authCheck, userController.auth);
router.get('/', authCheck, roleCheck, userController.getAll);
router.delete('/:id', authCheck, roleCheck, userController.deleteUser);

module.exports = router;