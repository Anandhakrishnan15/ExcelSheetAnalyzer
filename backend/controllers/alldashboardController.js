const User = require("../models/User");
const AIReport = require("../models/AIReport");
const SavedGraph = require("../models/SavedGraph");
const UserUploadedFile = require("../models/UploadedFile");

exports.getDashboardData = async (req, res) => {
    try {
        // ─────────────────────────────────────────────
        // 🔹 1. Platform-wide Totals (Global Overview)
        // ─────────────────────────────────────────────
        const [totalUsers, reportAgg, chartAgg, uploadAgg] = await Promise.all([
            User.countDocuments({}),
            AIReport.aggregate([
                { $group: { _id: null, count: { $sum: { $size: "$reports" } } } },
            ]),
            SavedGraph.aggregate([
                { $unwind: "$charts" },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        totalPDF: { $sum: "$charts.downloedGraphPDF" },
                        totalImage: { $sum: "$charts.downloedGraphIMages" },
                    },
                },
            ]),
            UserUploadedFile.aggregate([
                { $group: { _id: null, count: { $sum: { $size: "$uploadedFiles" } } } },
            ]),
        ]);

        const globalTotals = {
            totalUsers,
            totalReports: reportAgg[0]?.count || 0,
            totalCharts: chartAgg[0]?.count || 0,
            totalPDFDownloads: chartAgg[0]?.totalPDF || 0,
            totalImageDownloads: chartAgg[0]?.totalImage || 0,
            totalUploads: uploadAgg[0]?.count || 0,
        };

        // ─────────────────────────────────────────────
        // 🔹 2. All Users & Their Stats (No Filters)
        // ─────────────────────────────────────────────
        const users = await User.find({})
            .select("_id name email role createdAt")
            .sort({ createdAt: -1 })
            .lean();

        const userIds = users.map((u) => u._id);

        const [reportCounts, chartCounts, fileCounts] = await Promise.all([
            AIReport.aggregate([
                { $match: { user: { $in: userIds } } },
                {
                    $group: {
                        _id: "$user",
                        count: { $sum: { $size: "$reports" } },
                    },
                },
            ]),
            SavedGraph.aggregate([
                { $match: { user: { $in: userIds } } },
                { $unwind: "$charts" },
                {
                    $group: {
                        _id: "$user",
                        chartCount: { $sum: 1 },
                        totalGraphImageDownloads: {
                            $sum: "$charts.downloedGraphIMages",
                        },
                        totalGraphPDFDownloads: { $sum: "$charts.downloedGraphPDF" },
                    },
                },
            ]),
            UserUploadedFile.aggregate([
                { $match: { user: { $in: userIds } } },
                {
                    $group: {
                        _id: "$user",
                        count: { $sum: { $size: "$uploadedFiles" } },
                    },
                },
            ]),
        ]);

        const toMap = (arr, key = "count") =>
            Object.fromEntries(arr.map((item) => [item._id.toString(), item[key]]));

        const reportMap = toMap(reportCounts);
        const fileMap = toMap(fileCounts);

        const chartMap = Object.fromEntries(
            chartCounts.map((item) => [
                item._id.toString(),
                {
                    chartCount: item.chartCount,
                    totalGraphImageDownloads: item.totalGraphImageDownloads,
                    totalGraphPDFDownloads: item.totalGraphPDFDownloads,
                },
            ])
        );

        const enrichedUsers = users.map((user) => {
            const id = user._id.toString();
            const charts = chartMap[id] || {};
            return {
                ...user,
                reportCount: reportMap[id] || 0,
                chartCount: charts.chartCount || 0,
                uploadCount: fileMap[id] || 0,
                totalGraphImageDownloads: charts.totalGraphImageDownloads || 0,
                totalGraphPDFDownloads: charts.totalGraphPDFDownloads || 0,
            };
        });

        res.json({
            success: true,
            data: {
                globalTotals,
                perUser: enrichedUsers,
            },
        });
    } catch (err) {
        console.error("Dashboard aggregation failed:", err);
        res.status(500).json({
            success: false,
            message: "Server error while fetching dashboard data.",
        });
    }
};
exports.getGlobalDashboardStats = async (req, res) => {
    try {
        const [totalUsers, reportAgg, chartAgg, uploadAgg] = await Promise.all([
            User.countDocuments({}),
            AIReport.aggregate([
                { $group: { _id: null, count: { $sum: { $size: "$reports" } } } },
            ]),
            SavedGraph.aggregate([
                { $unwind: "$charts" },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        totalPDF: { $sum: "$charts.downloedGraphPDF" },
                        totalImage: { $sum: "$charts.downloedGraphIMages" },
                    },
                },
            ]),
            UserUploadedFile.aggregate([
                { $group: { _id: null, count: { $sum: { $size: "$uploadedFiles" } } } },
            ]),
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalReports: reportAgg[0]?.count || 0,
                totalCharts: chartAgg[0]?.count || 0,
                totalPDFDownloads: chartAgg[0]?.totalPDF || 0,
                totalImageDownloads: chartAgg[0]?.totalImage || 0,
                totalUploads: uploadAgg[0]?.count || 0,
            },
        });
    } catch (err) {
        console.error("Global stats error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch global dashboard stats.",
        });
    }
};
exports.getAllUserStats = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const users = await User.find({})
            .select("_id name email role blocked createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalUsers = await User.countDocuments({});
        const userIds = users.map((u) => u._id);

        const [reportCounts, chartCounts, fileCounts] = await Promise.all([
            AIReport.aggregate([
                { $match: { user: { $in: userIds } } },
                { $group: { _id: "$user", count: { $sum: { $size: "$reports" } } } },
            ]),
            SavedGraph.aggregate([
                { $match: { user: { $in: userIds } } },
                { $unwind: "$charts" },
                {
                    $group: {
                        _id: "$user",
                        chartCount: { $sum: 1 },
                        totalGraphImageDownloads: { $sum: "$charts.downloedGraphIMages" },
                        totalGraphPDFDownloads: { $sum: "$charts.downloedGraphPDF" },
                    },
                },
            ]),
            UserUploadedFile.aggregate([
                { $match: { user: { $in: userIds } } },
                {
                    $group: {
                        _id: "$user",
                        count: { $sum: { $size: "$uploadedFiles" } },
                    },
                },
            ]),
        ]);

        const reportMap = Object.fromEntries(
            reportCounts.map((r) => [r._id.toString(), r.count])
        );
        const fileMap = Object.fromEntries(
            fileCounts.map((r) => [r._id.toString(), r.count])
        );
        const chartMap = Object.fromEntries(
            chartCounts.map((r) => [
                r._id.toString(),
                {
                    chartCount: r.chartCount,
                    totalGraphImageDownloads: r.totalGraphImageDownloads,
                    totalGraphPDFDownloads: r.totalGraphPDFDownloads,
                },
            ])
        );

        const enrichedUsers = users.map((user) => {
            const id = user._id.toString();
            const charts = chartMap[id] || {};
            return {
                ...user,
                reportCount: reportMap[id] || 0,
                chartCount: charts.chartCount || 0,
                uploadCount: fileMap[id] || 0,
                totalGraphImageDownloads: charts.totalGraphImageDownloads || 0,
                totalGraphPDFDownloads: charts.totalGraphPDFDownloads || 0,
            };
        });

        res.json({
            success: true,
            data: enrichedUsers,
            pagination: {
                currentPage: page,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                hasMore: page * limit < totalUsers,
            },
        });
    } catch (err) {
        console.error("User stats error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user stats.",
        });
    }
};

