const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const { auth } = require('../middleware/auth');

router.get('/', ctrl.list);
router.post('/', auth('admin'), ctrl.create);
router.put('/:id', auth('admin'), ctrl.update);
router.delete('/:id', auth('admin'), ctrl.remove);

module.exports = router;
