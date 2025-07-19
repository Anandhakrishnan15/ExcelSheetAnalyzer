// controllers/dashboardController.js
const { getUserDashboardCounts } = require("../utils/getUserDashboardCounts");

exports.getDashboardCounts = async (req, res) => {
    try {
        const userId = req.user._id;
        const counts = await getUserDashboardCounts(userId);
        res.json({
            success: true,
            data: counts
        });
    } catch (err) {
        console.error("Error fetching dashboard counts:", err);
        res.status(500).json({
            success: false,
            error: "Could not load dashboard counts"
        });
    }
};
