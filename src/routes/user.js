const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { signup, login } = require('../controllers/users');
const { userSignup, login: loginRules } = require('../validators');
const validate = require('../middleware/validate');
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many authentication requests. Try again in 15 minutes.' } });
router.post('/signup', authLimiter, userSignup, validate, signup);
router.post('/login', authLimiter, loginRules, validate, login);
module.exports = router;
