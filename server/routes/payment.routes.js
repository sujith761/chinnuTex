const router = require('express').Router();
const ctrl = require('../controllers/payment.controller');
const { auth } = require('../middleware/auth');

router.post('/order', auth(), ctrl.createOrder);
router.post('/verify', auth(), ctrl.verify);
router.get('/test-email', ctrl.testEmail);

module.exports = router;
