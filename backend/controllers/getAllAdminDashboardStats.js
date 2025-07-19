const mongoose = require("mongoose");
const User = require("../models/User");

const getAllAdminDashboardStats = async (req, res) => {
    try {
        // 1. Find all admin users
        const admins = await User.find({ role: "admin" }).select("_id name email role blocked");

        const adminIds = admins.map((admin) => admin._id);

        // 2. Aggregate stats for those users
        const stats = await mongoose.model("User").aggregate([
            { $match: { _id: { $in: adminIds } } },

            // Lookup AI Reports
            {
                $lookup: {
                    from: "aireports",
                    localField: "_id",
                    foreignField: "user",
                    as: "aiReportsDocs",
                },
            },

            // Lookup Saved Charts
            {
                $lookup: {
                    from: "savedgraphs",
                    localField: "_id",
                    foreignField: "user",
                    as: "savedGraphsDocs",
                },
            },

            // Lookup Uploaded Files
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

        // 3. Merge stats into admin users
        const statMap = new Map(stats.map((s) => [s.userId.toString(), s]));

        const enrichedAdmins = admins.map((admin) => {
            const stat = statMap.get(admin._id.toString()) || {};
            return {
                ...admin.toObject(),
                reports: stat.reportCount || 0,
                charts: stat.chartCount || 0,
                uploads: stat.uploadCount || 0,
                downloadGraphImages: stat.totalGraphImages || 0,
                downloadGraphPDF: stat.totalGraphPDF || 0,
            };
        });

        return res.status(200).json({ admins: enrichedAdmins });
    } catch (error) {
        console.error("getAllAdminDashboardStats error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllAdminDashboardStats };
