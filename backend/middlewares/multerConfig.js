const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const cron = require("node-cron");

// Storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});

// ✅ Cleanup Task — runs every hour
cron.schedule("0 * * * *", async () => {
    const directory = path.join(__dirname, "../uploads");

    try {
        const files = await fs.readdir(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fs.stat(filePath);
            const now = Date.now();
            const fileAge = now - stats.ctimeMs;

            // Delete if older than 24 hours
            if (fileAge > 24 * 60 * 60 * 1000) {
                await fs.remove(filePath);
                // console.log(`Deleted old file: ${file}`);
            }
        }
    } catch (err) {
        console.error("Error during file cleanup:", err);
    }
});

module.exports = upload;
