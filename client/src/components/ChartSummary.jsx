import { useState } from "react";
import { generateAIReport, saveAIReportToChart } from "../services/AuthAPI";

const ChartSummary = ({ chart, onSummarySaved }) => {
  const [summary, setSummary] = useState(chart.AIReport || "");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(!!chart.AIReport);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await generateAIReport({
        chartId: chart.chartId,
        title: chart.title,
        type: chart.type,
        uploadedFile: chart.uploadedFile,
        data: chart.data,
        config: chart.config,
      });

      setSummary(response.data.report);
      setSaved(false);
    } catch (err) {
      console.error("Failed to generate summary:", err);
      setError(
        err.response?.data?.message ||
          "Error generating summary. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSummary = async () => {
    if (!summary) return;
    setSaving(true);
    setError("");

    try {
      await saveAIReportToChart({
        chartId: chart.chartId,
        generatedReport: summary,
      });
      setSaved(true);
      if (onSummarySaved) onSummarySaved(); // Refresh parent chart data
    } catch (err) {
      console.error("Failed to save summary:", err);
      setError(
        err.response?.data?.message || "Error saving summary. Try again later."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-[var(--card)]">
      <h3 className="text-lg font-semibold mb-2">AI Generated Summary</h3>

      {summary ? (
        <>
          <p className="text-sm whitespace-pre-wrap mb-2">{summary}</p>
          {!saved && (
            <div className="flex gap-2">
              <button
                onClick={handleSaveSummary}
                disabled={saving}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-500 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Summary"}
              </button>
              <button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? "Re-generating..." : "Re-generate"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <p className="text-sm text-gray-500 mb-2">
            No AI summary available for this chart.
          </p>
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate AI Summary"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChartSummary;
