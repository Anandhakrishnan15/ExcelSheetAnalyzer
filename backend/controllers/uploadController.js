const UploadedFileSchema = require("../models/UploadedFile");
const fs = require("fs");
const path = require("path");

exports.uploadFile = async (req, res) => {
  try {
    const { fileName, rows } = req.body;

    // 1. Validate inputs
    if (!fileName || !rows) {
      return res.status(400).json({
        message: "fileName and rows are required.",
      });
    }

    // 2. Parse and validate rows
    let parsedRows;
    try {
      parsedRows = JSON.parse(rows);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid JSON in rows.",
      });
    }

    if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
      return res.status(400).json({
        message: "rows must be a non-empty array.",
      });
    }

    // 3. Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    const file = req.file;

    // 4. Construct upload metadata
    const newUpload = {
      fileName,
      rows: parsedRows,
      filePath: null, // ⛔️ no file path (in-memory only)
      originalName: file?.originalname || null,
      mimeType: file?.mimetype || null,
      size: file?.size || null,
      createdAt: new Date(),
    };

    // 5. Save upload to user's document
    let userUploads = await UploadedFileSchema.findOne({ user: req.user._id });

    if (userUploads) {
      userUploads.uploadedFiles.unshift(newUpload);
      await userUploads.save();
    } else {
      userUploads = await UploadedFileSchema.create({
        user: req.user._id,
        uploadedFiles: [newUpload],
      });
    }

    // 6. Success response
    res.status(201).json({
      message: "File uploaded successfully.",
      data: newUpload,
    });
  } catch (err) {
    console.error("Upload error:", err.message, err.stack);
    res.status(500).json({ message: "Server error." });
  }
};



exports.getUploadFiles = async (req, res) => {
  try {
    const doc = await UploadedFileSchema.findOne({ user: req.user._id });

    if (!doc || !doc.uploadedFiles || doc.uploadedFiles.length === 0) {
      return res.json([]);
    }

    const results = [];

    for (const file of doc.uploadedFiles) {
      let fileExists = false;

      if (file.filePath) {
        const absolutePath = path.resolve(file.filePath);
        fileExists = fs.existsSync(absolutePath);
      }

      results.push({
        ...file.toObject(),
        source: fileExists ? "multer" : "database",
        fileExists,
      });
    }

    res.json({
      uploadedFiles: results,
    });
  } catch (err) {
    console.error("❌ Fetch files error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.downloadFileContent = (req, res) => {
    const { filePath } = req.query;

    if (!filePath) {
        return res.status(400).json({ message: "filePath is required." });
    }

    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ message: "File not found on disk." });
    }

    res.download(absolutePath);
};

// exports.getUploadFiles = async (req, res) => {
//     try {
//         const files = await UploadedFileSchema.find({ user: req.user._id }).sort({ createdAt: -1 });
//         res.json(files);
//     } catch (err) {
//         console.error("❌ Fetch files error:", err);
//         res.status(500).json({ message: "Server error." });
//     }
// };
