const User = require("../models/User");
const SavedGraph = require("../models/SavedGraph");
const UserUploadedFiles = require("../models/UploadedFile");
const AIReport = require("../models/AIReport");

const getFullUserDataById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const savedGraphDoc = await SavedGraph.findOne({ user: userId });
        const savedCharts = savedGraphDoc ? savedGraphDoc.charts : [];

        const uploadedFilesDoc = await UserUploadedFiles.findOne({ user: userId });
        const uploadedFiles = uploadedFilesDoc ? uploadedFilesDoc.uploadedFiles : [];

        const aiReportDoc = await AIReport.findOne({ user: userId });
        const reports = aiReportDoc ? aiReportDoc.reports : [];

        // Calculate totals
        const totalDownloadedImages = savedCharts.reduce(
            (acc, chart) => acc + (chart.downloedGraphIMages || 0),
            0
        );

        const totalDownloadedPDFs = savedCharts.reduce(
            (acc, chart) => acc + (chart.downloedGraphPDF || 0),
            0
        );

        const response = {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "user",
                createdAt: user.createdAt,
                lastLogin: user.lastLogin || null,
                isBlocked: user.blocked || false,
                totalReports: reports.length,
            },
            savedCharts: savedCharts.map((chart) => ({
                chartId: chart.chartId,
                title: chart.title,
                type: chart.type,
                data: chart.data,
                uploadedFile: chart.uploadedFile,
                config: chart.config,
                createdAt: chart.createdAt,
                AIReport: chart.AIReport,
                downloedGraphIMages: chart.downloedGraphIMages,
                downloedGraphPDF: chart.downloedGraphPDF,
                saved: chart.saved,
                coin: chart?.config?.coin || null,
            })),
            uploadedFiles,
            reports,
            totals: {
                downloadedImages: totalDownloadedImages,
                downloadedPDFs: totalDownloadedPDFs,
            },
        };

        res.status(200).json(response);
    } catch (err) {
        console.error("Error in getFullUserDataById:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getFullUserDataById };
