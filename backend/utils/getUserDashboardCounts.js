const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

async function getUserDashboardCounts(userId) {
    if (!ObjectId.isValid(userId)) {
        throw new Error("Invalid userId");
    }

    const [result] = await mongoose.model("User").aggregate([
        {
            $match: { _id: new ObjectId(userId) }
        },
        // Lookup AI Reports
        {
            $lookup: {
                from: "aireports",
                localField: "_id",
                foreignField: "user",
                as: "aiReportsDocs"
            }
        },
        // Lookup Uploaded Files
        {
            $lookup: {
                from: "useruploadedfiles",
                localField: "_id",
                foreignField: "user",
                as: "uploadedFilesDocs"
            }
        },
        // Lookup Saved Graphs
        {
            $lookup: {
                from: "savedgraphs",
                localField: "_id",
                foreignField: "user",
                as: "savedGraphsDocs"
            }
        },
        // Pre-compute counts before unwinds
        {
            $addFields: {
                reportCount: {
                    $cond: [
                        { $gt: [{ $size: "$aiReportsDocs" }, 0] },
                        {
                            $size: {
                                $ifNull: [{ $arrayElemAt: ["$aiReportsDocs.reports", 0] }, []]
                            }
                        },
                        0
                    ]
                },
                uploadCount: {
                    $cond: [
                        { $gt: [{ $size: "$uploadedFilesDocs" }, 0] },
                        {
                            $size: {
                                $ifNull: [
                                    { $arrayElemAt: ["$uploadedFilesDocs.uploadedFiles", 0] },
                                    []
                                ]
                            }
                        },
                        0
                    ]
                }
            }
        },
        // Unwind savedGraphsDocs to get charts
        {
            $unwind: {
                path: "$savedGraphsDocs",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$savedGraphsDocs.charts",
                preserveNullAndEmptyArrays: true
            }
        },
        // Group only downloads
        {
            $group: {
                _id: "$_id",
                totalImageDownloads: {
                    $sum: {
                        $ifNull: ["$savedGraphsDocs.charts.downloedGraphIMages", 0]
                    }
                },
                totalPDFDownloads: {
                    $sum: {
                        $ifNull: ["$savedGraphsDocs.charts.downloedGraphPDF", 0]
                    }
                },
                chartCount: {
                    $sum: {
                        $cond: [{ $gt: ["$savedGraphsDocs.charts", null] }, 1, 0]
                    }
                },
                // Keep first precomputed counts
                reportCount: { $first: "$reportCount" },
                uploadCount: { $first: "$uploadCount" }
            }
        },
        {
            $project: {
                _id: 0,
                reportCount: 1,
                uploadCount: 1,
                chartCount: 1,
                totalImageDownloads: 1,
                totalPDFDownloads: 1
            }
        }
    ]);

    return (
        result || {
            reportCount: 0,
            chartCount: 0,
            uploadCount: 0,
            totalImageDownloads: 0,
            totalPDFDownloads: 0
        }
    );
}

module.exports = { getUserDashboardCounts };
