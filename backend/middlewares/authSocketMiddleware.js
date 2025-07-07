const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token ||
            (socket.handshake.headers?.authorization
                ? socket.handshake.headers.authorization.split(" ")[1]
                : null);

        if (!token) {
            console.log("❌ No token provided in socket handshake.");
            return next(new Error("No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            console.log("❌ User not found for token.");
            return next(new Error("User not found"));
        }

        console.log("✅ Socket handshake authorized:", user.email);

        socket.user = user; // Attach to socket
        next();
    } catch (err) {
        console.error("❌ Socket auth error:", err.message);
        next(new Error("Invalid token"));
    }
};
