const AIReport = require("../models/AIReport");
const User = require("../models/User");
const openai = require("../config/openai");
const SavedGraph = require("../models/SavedGraph");



exports.generateAIReport = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: user not found.' });
        }

        const { chartId, title, type, uploadedFile, data, config } = req.body;

        if (!config || !config.xAxis || !config.yAxis) {
            return res.status(400).json({ message: 'Missing or invalid chart data.' });
        }

        const numDataPoints = data.length;
        const yAxes = Array.isArray(config.yAxis) ? config.yAxis : [config.yAxis];

        // Compute stats
        const stats = {};
        const monthOverMonth = {};
        const forecast = {};

        yAxes.forEach(yAxisKey => {
            let sum = 0;
            let min = Number.POSITIVE_INFINITY;
            let max = Number.NEGATIVE_INFINITY;
            const changes = [];

            data.forEach((entry, idx) => {
                const value = entry[yAxisKey];
                if (typeof value === "number") {
                    sum += value;
                    if (value < min) min = value;
                    if (value > max) max = value;

                    // Month-over-month % change
                    if (idx > 0) {
                        const prev = data[idx - 1][yAxisKey];
                        if (typeof prev === "number" && prev !== 0) {
                            const pctChange = ((value - prev) / prev) * 100;
                            changes.push(`${data[idx - 1][config.xAxis]} to ${data[idx][config.xAxis]}: ${pctChange.toFixed(2)}%`);
                        }
                    }
                }
            });

            const avg = sum / numDataPoints;

            // Simple slope: (last - first) / (n - 1)
            const first = data[0][yAxisKey];
            const last = data[data.length - 1][yAxisKey];
            let slope = 0;
            if (typeof first === "number" && typeof last === "number") {
                slope = (last - first) / (numDataPoints - 1);
            }

            // Forecast next value
            let nextValue = null;
            if (typeof last === "number") {
                nextValue = last + slope;
            }

            stats[yAxisKey] = {
                sum,
                avg,
                min,
                max,
                slope,
                nextValue
            };

            monthOverMonth[yAxisKey] = changes;
            forecast[yAxisKey] = nextValue;
        });

        // Build stats text
        const statsText = Object.entries(stats)
            .map(([key, s]) =>
                `${key}: total ${s.sum}, average ${s.avg.toFixed(2)}, min ${s.min}, max ${s.max}, slope ${s.slope.toFixed(2)}`
            )
            .join("\n");

        // Month-over-month text
        const changesText = Object.entries(monthOverMonth)
            .map(([key, changes]) =>
                `${key} Month-over-Month Changes:\n${changes.join("\n")}`
            )
            .join("\n\n");

        // Forecast text
        const forecastText = Object.entries(forecast)
            .map(([key, val]) =>
                `${key}: forecasted next period value ${val !== null ? val.toFixed(2) : "N/A"}`
            )
            .join("\n");

        const prompt = `
You are an expert data analyst. Generate a clear, concise business report for this chart.

Chart Details:
- Title: ${title}
- Type: ${type}
- X-axis: ${config.xAxis}
- Y-axes: ${yAxes.join(", ")}
- Number of data points: ${numDataPoints}
- Time Period: ${data[0][config.xAxis]} to ${data[data.length - 1][config.xAxis]}

Statistics:
${statsText}

${changesText}

Forecast:
${forecastText}

Write the report in 2 paragraphs describing:
1) Overall trends, variability, and recent changes.
2) Any risks, opportunities, and forecasts.
`;

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful data analyst assistant." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3
        });

        const generatedReport = completion.choices[0].message.content.trim();

        // Save in DB
        let existingReportDoc = await AIReport.findOne({ user: userId });
        if (!existingReportDoc) {
            existingReportDoc = new AIReport({
                user: userId,
                reports: [],
            });
        }

        existingReportDoc.reports.push({
            chartId,
            title,
            type,
            uploadedFile,
            generatedReport,
        });

        await existingReportDoc.save();

        res.status(201).json({
            message: 'AI report generated and saved successfully.',
            report: generatedReport,
        });

    } catch (error) {
        console.error('Error generating AI report:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const userId = req.user._id;
        const reportDoc = await AIReport.findOne({ user: userId });

        if (!reportDoc) {
            return res.status(404).json({ message: "No reports found for this user." });
        }

        res.status(200).json({
            reports: reportDoc.reports
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Server error." });
    }
};
exports.saveAIReportToChart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chartId, generatedReport } = req.body;

        if (!generatedReport || !chartId) {
            return res.status(400).json({ message: "Missing chartId or generated report." });
        }

        // Find the SavedGraph for this user
        const savedGraph = await SavedGraph.findOne({ user: userId });
        if (!savedGraph) {
            return res.status(404).json({ message: "Saved graphs not found for user." });
        }

        // Find the chart by chartId
        const chart = savedGraph.charts.find((c) => c.chartId === chartId);
        if (!chart) {
            return res.status(404).json({ message: "Chart not found." });
        }

        // Update AIReport and saved flag
        chart.AIReport = generatedReport;
        chart.saved = true;

        await savedGraph.save();

        res.status(200).json({ message: "AI report saved in chart successfully." });
    } catch (error) {
        console.error("Error saving AI report to chart:", error);
        res.status(500).json({ message: "Server error." });
    }
};
