const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    chartId: {
        type: String,
        required: true,
    },
    title: String,
    type: String,
    uploadedFile: String,
    generatedReport: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AIReportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reports: [ReportSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.models.AIReport || mongoose.model('AIReport', AIReportSchema);
