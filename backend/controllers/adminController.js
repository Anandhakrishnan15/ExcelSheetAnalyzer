const mongoose = require("mongoose");
const User = require("../models/User");

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const searchRegex = new RegExp(query, "i");
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);

        // 1. Find matched users
        const users = await User.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                ...(isObjectId ? [{ _id: query }] : []),
            ],
        }).select("_id name email role blocked");

        const userIds = users.map((u) => u._id);

        // 2. Aggregate report/chart/upload counts + download totals
        const counts = await mongoose.model("User").aggregate([
            { $match: { _id: { $in: userIds } } },

            // AI reports
            {
                $lookup: {
                    from: "aireports",
                    localField: "_id",
                    foreignField: "user",
                    as: "aiReportsDocs",
                },
            },
            // Saved charts
            {
                $lookup: {
                    from: "savedgraphs",
                    localField: "_id",
                    foreignField: "user",
                    as: "savedGraphsDocs",
                },
            },
            // Uploaded files
            {
                $lookup: {
                    from: "useruploadedfiles",
                    localField: "_id",
                    foreignField: "user",
                    as: "userFilesDocs",
                },
            },

            // Final projection
            {
                $project: {
                    userId: "$_id",
                    reportCount: {
                        $size: { $ifNull: [{ $arrayElemAt: ["$aiReportsDocs.reports", 0] }, []] },
                    },
                    chartCount: {
                        $size: { $ifNull: [{ $arrayElemAt: ["$savedGraphsDocs.charts", 0] }, []] },
                    },
                    uploadCount: {
                        $size: { $ifNull: [{ $arrayElemAt: ["$userFilesDocs.uploadedFiles", 0] }, []] },
                    },
                    totalGraphImages: {
                        $sum: {
                            $map: {
                                input: { $ifNull: [{ $arrayElemAt: ["$savedGraphsDocs.charts", 0] }, []] },
                                as: "chart",
                                in: "$$chart.downloedGraphIMages",
                            },
                        },
                    },
                    totalGraphPDF: {
                        $sum: {
                            $map: {
                                input: { $ifNull: [{ $arrayElemAt: ["$savedGraphsDocs.charts", 0] }, []] },
                                as: "chart",
                                in: "$$chart.downloedGraphPDF",
                            },
                        },
                    },
                },
            },
        ]);

        // 3. Merge counts with users
        const countMap = new Map(counts.map((c) => [c.userId.toString(), c]));

        const enrichedUsers = users.map((user) => {
            const count = countMap.get(user._id.toString()) || {};
            return {
                ...user.toObject(),
                reports: count.reportCount || 0,
                charts: count.chartCount || 0,
                uploads: count.uploadCount || 0,
                downloadGraphImages: count.totalGraphImages || 0,
                downloadGraphPDF: count.totalGraphPDF || 0,
            };
        });

        return res.status(200).json({ users: enrichedUsers });
    } catch (error) {
        console.error("searchUsers error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { searchUsers };
