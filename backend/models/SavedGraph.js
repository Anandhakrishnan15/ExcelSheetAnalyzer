const mongoose = require("mongoose");

const ChartSchema = new mongoose.Schema(
    {
        chartId: { type: String, required: true },
        title: { type: String, default: "Untitled Chart" },
        type: { type: String, enum: ["bar", "line", "pie", "area", "scatter"], default: "bar" },
        uploadedFile: { type: String, required: true },
        config: { type: Object, default: {} },
        createdAt: { type: Date, default: Date.now },
        saved:{type:Boolean, require:true}
    },
    { _id: false }
);

const SavedGraphSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true   // One per user
        },
        charts: [ChartSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("SavedGraph", SavedGraphSchema);

