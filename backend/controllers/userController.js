const User = require('../models/User');

// Get current user (from token)
exports.getMe = async (req, res) => {
    try {
        const user = req.user; // already attached by protect middleware
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(user.blocked)
        {
           return res.status(401).json({message:"You are Blocke by the Authoraty contact for more INfomation"})
        }
        res.status(200).json(user); // optionally sanitize here
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Block or Unblock a user
exports.blockUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.blocked = !user.blocked;
        await user.save();

        res.status(200).json({ message: `User ${user.blocked ? "blocked" : "unblocked"}` });
    } catch (error) {
        console.error("Error blocking user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Change user role
exports.changeUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = role || "user";
        await user.save();

        res.status(200).json({ message: `User role updated to ${role}` });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Optionally delete associated data (e.g. reports)
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Revoke user access (e.g., force logout)
exports.revokeUserAccess = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        res.status(200).json({ message: "User access revoked (token invalidated)" });
    } catch (error) {
        console.error("Error revoking access:", error);
        res.status(500).json({ message: "Server error" });
    }
};
