const UploadedFileSchema = require('../models/UploadedFile');

// POST /api/uploads
exports.uploadFile = async (req, res) => {
    try {
        const { fileName, rows } = req.body;

        // ✅ Fix validation logic
        if (!fileName || !rows || !Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({
                message: 'fileName and rows are required and rows must be a non-empty array.'
            });
        }

        const created = await UploadedFileSchema.create({
            user: req.user._id,
            fileName,
            rows
        });

        res.status(201).json({
            message: 'File uploaded successfully.',
            data: created
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/uploads
exports.getUploadFiles = async (req, res) => {
    try {
        const files = await UploadedFileSchema.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        console.error('Fetch files error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
