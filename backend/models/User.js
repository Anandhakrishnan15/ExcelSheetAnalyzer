const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    blocked: {
        type: Boolean,
        default: false,
    },

    // ✅ Add these for OTP-based password reset
    resetOTP: {
        type: String,
        default: null,
    },
    otpExpiry: {
        type: Date,
        default: null,
    },

}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
