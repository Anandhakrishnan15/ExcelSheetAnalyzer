const { verifyTokenAndGetUser } = require("./authUtils");

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        const user = await verifyTokenAndGetUser(token);
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({ message: "Not authorized" });
    }
};

module.exports = protect;
