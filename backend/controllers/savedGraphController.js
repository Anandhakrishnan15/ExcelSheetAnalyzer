// controllers/savedGraphController.js
const SavedGraph = require("../models/SavedGraph");

// Save or update graphs for a file
exports.saveCharts = async (req, res) => {
    const { charts } = req.body;

    if (!charts || !Array.isArray(charts)) {
        return res.status(400).json({ message: "charts array is required" });
    }

    try {
        let savedGraph = await SavedGraph.findOne({ user: req.user._id });

        if (!savedGraph) {
            // Create new document for the user
            savedGraph = await SavedGraph.create({
                user: req.user._id,
                charts
            });
            return res.status(201).json({ message: "Charts saved", savedGraph });
        }

        // Update or insert each chart
        for (const chart of charts) {
            const index = savedGraph.charts.findIndex(c => c.chartId === chart.chartId);

            if (index !== -1) {
                // Update existing chart
                savedGraph.charts[index] = chart;
            } else {
                // Add new chart
                savedGraph.charts.push(chart);
            }
        }

        await savedGraph.save();
        res.status(200).json({ message: "Charts saved/updated", savedGraph });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// GET /api/saved-graphs/my-charts
exports.getMyCharts = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: No user ID." });
        }

        let savedGraph = await SavedGraph.findOne({ user: userId });

        // Create an empty document if none exists
        if (!savedGraph) {
            savedGraph = new SavedGraph({ user: userId, charts: [] });
            await savedGraph.save();
        }

        res.status(200).json(savedGraph.charts || []);
    } catch (error) {
        console.error("Error fetching saved charts:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

