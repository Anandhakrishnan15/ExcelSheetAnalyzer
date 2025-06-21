const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
} = require('../controllers/authController');

// @route   POST /auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /auth/login
// @desc    Login user
router.post('/login', loginUser);

module.exports = router;
