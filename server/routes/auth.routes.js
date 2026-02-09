const router = require('express').Router();
const { register, login, adminLogin, googleStart, googleCallback } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);

// Google OAuth 2.0
router.get('/google', googleStart);
router.get('/google/callback', googleCallback);

module.exports = router;
