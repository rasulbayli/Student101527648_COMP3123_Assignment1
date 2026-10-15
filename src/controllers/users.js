const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { log } = require('../utils/logger');

async function signup(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });
    if (exists) return res.status(409).json({ error: 'Username or email already exists' });
    const user = await User.create({ username, email, password: await bcrypt.hash(password, 12) });
    log('info', 'User registered', { userId: user.id });
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const identity = username ? { username } : { email: String(email || '').toLowerCase() };
    const user = await User.findOne(identity).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      log('warn', 'Authentication failure', { identityType: username ? 'username' : 'email' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    log('info', 'Authentication success', { userId: user.id });
    res.status(200).json({ message: 'Login successful', token, token_type: 'Bearer', expires_in: process.env.JWT_EXPIRES_IN || '1h' });
  } catch (err) { next(err); }
}
module.exports = { signup, login };
