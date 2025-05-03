const express = require('express');
const router = express.Router();
const { register, login, getMe, verifyToken } = require('../controllers/authController');

// Route for registering a new user
router.post('/register', register);

// Route for logging in an existing user
router.post('/login', login);

// Route for getting the current user
router.get('/me', getMe); // Requires auth middleware if implemented

// ✅ Add token verification route
router.get('/verify', verifyToken);

module.exports = router;
