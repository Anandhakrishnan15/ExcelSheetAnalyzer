const mongoose = require('mongoose');

const UploadedFileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        rows: {
            type: [Object],
            default: []
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserUploadedFile", UploadedFileSchema);
