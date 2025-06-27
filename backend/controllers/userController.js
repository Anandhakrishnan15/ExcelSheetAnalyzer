const User = require('../models/User');

exports.getMe = async (req, res) => {
    try {
        const user = req.user; // already attached by protect middleware
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user); // optionally sanitize here
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
};
