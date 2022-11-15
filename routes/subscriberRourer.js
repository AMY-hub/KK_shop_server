const Router = require('express');
const subscriberController = require('../controllers/subscriberController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', subscriberController.createSubscriber);
router.delete('/:id', authCheck, roleCheck, subscriberController.deleteSubscriber);
router.get('/', subscriberController.getAll);

module.exports = router;