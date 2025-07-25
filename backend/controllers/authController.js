const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// 🔐 Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_KEY,
        { expiresIn: '24h' }
    );
};

// 📝 Register User
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        const token = generateToken(user);
        return res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Registration error', error: error.message });
    }
};

// 🔐 Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        if (user.blocked) return res.status(403).json({ message: 'Your account is blocked' });

        const token = generateToken(user);
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Login error', error: error.message });
    }
};

// 📩 Send OTP to Email
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        user.resetOTP = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP to reset your password is: ${otp}`,
        });

        return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// ✅ Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.resetOTP !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        return res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        return res.status(500).json({ message: 'OTP verification failed', error: error.message });
    }
};

// 🔁 Reset Password
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.resetOTP !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOTP = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Password reset failed', error: error.message });
    }
};
