const Router = require('express');
const certificateController = require('../controllers/certificateController');
const authCheck = require('../middleware/authCheck');
const roleCheck = require('../middleware/roleCheck');

const router = new Router();

router.post('/', authCheck, roleCheck, certificateController.createCertificate);
router.get('/', certificateController.getAll);
router.delete('/:id',authCheck, roleCheck, certificateController.deleteCertificate);

module.exports = router;