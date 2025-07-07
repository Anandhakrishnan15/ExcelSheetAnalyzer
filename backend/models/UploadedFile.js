const mongoose = require("mongoose");

const UploadedFileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true, // one document per user
            required: true,
        },
        uploadedFiles: [
            {
                fileName: { type: String, required: true },
                rows: { type: [Object], default: [] },
                filePath: { type: String, default: null },
                originalName: { type: String, default: null },
                mimeType: { type: String, default: null },
                size: { type: Number, default: null },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserUploadedFiles", UploadedFileSchema);
