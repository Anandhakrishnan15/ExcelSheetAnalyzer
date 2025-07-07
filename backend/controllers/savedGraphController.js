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
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// GET /api/saved-graphs/my-charts
exports.getMyCharts = async (req, res) => {
    try {
        const savedGraph = await SavedGraph.findOne({ user: req.user._id });

        if (!savedGraph) {
            return res.status(404).json({ message: "No saved charts found." });
        }

        res.status(200).json(savedGraph.charts);
    } catch (error) {
        console.error("Error fetching charts:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// exports.getChartById = async (req, res) => {
//     try {
//         const { id } = req.body;

//         if (!id) {
//             return res.status(400).json({ message: "Chart ID is required." });
//         }

//         const savedGraph = await SavedGraph.findOne({ user: req.user._id });

//         if (!savedGraph) {
//             return res.status(404).json({ message: "No saved charts found." });
//         }

//         const chart = savedGraph.charts.find((c) => c._id.toString() === id);

//         if (!chart) {
//             return res.status(404).json({ message: "Chart not found." });
//         }

//         res.status(200).json(chart);
//     } catch (error) {
//         console.error("Error fetching chart by ID:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

