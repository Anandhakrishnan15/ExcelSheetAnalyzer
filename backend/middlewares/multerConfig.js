const multer = require("multer");
const path = require("path");

// Storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Uploads folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// Multer instance for multiple files
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Max 10 MB per file (adjust as needed)
    },
});

module.exports = upload;
