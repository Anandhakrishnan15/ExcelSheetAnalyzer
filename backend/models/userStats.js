const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

async function getUserDashboardCounts(userId) {
    const [result] = await mongoose
        .model("User")
        .aggregate([
            // 1) Match the user
            { $match: { _id: new ObjectId(userId) } },

            // 2) Lookup AI reports
            {
                $lookup: {
                    from: "aireports",          // MongoDB collection name
                    localField: "_id",
                    foreignField: "user",
                    as: "aiReportsDocs",
                },
            },
            // 3) Lookup Saved graphs
            {
                $lookup: {
                    from: "savedgraphs",
                    localField: "_id",
                    foreignField: "user",
                    as: "savedGraphsDocs",
                },
            },
            // 4) Lookup Uploaded files
            {
                $lookup: {
                    from: "useruploadedfiles",
                    localField: "_id",
                    foreignField: "user",
                    as: "userFilesDocs",
                },
            },

            // 5) Project out just the counts
            {
                $project: {
                    _id: 0,
                    reportCount: { $size: { $arrayElemAt: ["$aiReportsDocs.reports", 0] } },
                    chartCount: { $size: { $arrayElemAt: ["$savedGraphsDocs.charts", 0] } },
                    uploadCount: { $size: { $arrayElemAt: ["$userFilesDocs.uploadedFiles", 0] } },
                    // if you also track images or PDFs in those schemas, do more $size’s here
                },
            },
        ])
        .exec();

    return result || { reportCount: 0, chartCount: 0, uploadCount: 0 };
}

module.exports = { getUserDashboardCounts };
