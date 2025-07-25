const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    sendOTP,
    verifyOTP,
    resetPassword,
} = require('../controllers/authController');

// @route   POST /auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /auth/login
// @desc    Login user
router.post('/login', loginUser);

// @route   POST /auth/forgot-password
// @desc    Send OTP to email
router.post('/forgot-password', sendOTP);

// @route   POST /auth/verify-otp
// @desc    Verify OTP from user
router.post('/verify-otp', verifyOTP);

// @route   POST /auth/reset-password
// @desc    Reset password using verified OTP
router.post('/reset-password', resetPassword);

module.exports = router;
