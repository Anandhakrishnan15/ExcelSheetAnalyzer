const mongoose = require("mongoose");
const AIReport = require("./AIReport");

const ChartSchema = new mongoose.Schema(
    {
        chartId: { type: String, required: true },
        title: { type: String, default: "Untitled Chart" },
        type: { type: String, enum: ["bar", "line", "pie","doughnut","area", "scatter"], default: "bar" },
        data: { type: Object, default: {} },
        uploadedFile: { type: String, required: true },
        config: { type: Object, default: {} },
        createdAt: { type: Date, default: Date.now },
        AIReport: { type: String, default: "" },
        saved: { type: Boolean, required: true }
    },
    { _id: false }
);

const SavedGraphSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        charts: [ChartSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("SavedGraph", SavedGraphSchema);
