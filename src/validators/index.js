const { body, param, query } = require('express-validator');
const validEmail = (field) => body(field).isEmail().withMessage('Must be a valid email').normalizeEmail();
const userSignup = [body('username').trim().isLength({ min: 3, max: 40 }).withMessage('Username must be 3–40 characters'), validEmail('email'), body('password').isLength({ min: 8, max: 128 }).withMessage('Password must be 8–128 characters')];
const login = [body('password').isString().notEmpty().withMessage('Password is required'), body().custom(v => !!(v.username || v.email)).withMessage('Username or email is required')];
const employee = [body('first_name').trim().isLength({ min: 1, max: 60 }), body('last_name').trim().isLength({ min: 1, max: 60 }), validEmail('email'), body('position').trim().isLength({ min: 1, max: 80 }), body('salary').isFloat({ min: 0 }).withMessage('Salary must be a non-negative number').toFloat(), body('date_of_joining').isISO8601().withMessage('Date must be a valid ISO date').toDate(), body('department').trim().isLength({ min: 1, max: 80 })];
const idParam = [param('eid').isMongoId().withMessage('Employee ID must be a valid MongoDB ObjectId')];
const deleteId = [query('eid').isMongoId().withMessage('Employee ID must be a valid MongoDB ObjectId')];
module.exports = { userSignup, login, employee, idParam, deleteId };
