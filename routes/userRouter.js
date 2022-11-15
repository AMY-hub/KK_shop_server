const Router = require('express');
const userController = require('../controllers/userController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/registration', userController.register);
router.post('/login', userController.login);
router.get('/', authCheck, roleCheck, userController.getAll);
router.delete('/:id', authCheck, roleCheck, userController.deleteUser);
router.get('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.put('/card', authCheck, userController.updateCard);

module.exports = router;