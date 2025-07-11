import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ChartCard from "./ChartUploads/ChartCard";
import ChartSummary from "./ChartSummary";
import { getSavedChart } from "../services/AuthAPI";

const ChartDetail = () => {
  const { chartId } = useParams();
  const navigate = useNavigate();

  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("Chart");

  const canvasRef = useRef();

  // Fetch the chart by chartId on mount
  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await getSavedChart();
        const allCharts = res.data;
        const found = allCharts.find((c) => c.chartId === chartId);

        if (!found) {
          alert("Chart not found. Redirecting...");
          navigate("/upload");
          return;
        }

        setChart(found);

        // Delay rendering to ensure Chart.js mounts
        setTimeout(() => {
          setReady(true);
        }, 500);
      } catch (err) {
        console.error("Failed to fetch chart:", err);
        alert("Error loading chart.");
        navigate("/upload");
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [chartId, navigate]);

  // Function to re-fetch updated chart after saving summary
  const refreshChartFromServer = async () => {
    try {
      const res = await getSavedChart();
      const allCharts = res.data;
      const updated = allCharts.find((c) => c.chartId === chartId);
      if (updated) setChart(updated);
    } catch (err) {
      console.error("Failed to refresh chart:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  if (!chart) return null;

  const handleDownloadImage = () => {
    if (!ready || !canvasRef.current) {
      alert("Chart is not rendered yet.");
      return;
    }
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${chart.title || "chart"}.png`;
    link.click();
  };

  const handleDownloadPDF = () => {
    if (!ready || !canvasRef.current) {
      alert("Chart is not rendered yet.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Report for: ${chart.title}`, 14, 20);

    const dataUrl = canvasRef.current.toDataURL("image/png");
    let yOffset = 30;

    if (dataUrl) {
      doc.addImage(dataUrl, "PNG", 15, yOffset, 180, 80);
      yOffset += 90;
    }

    if (chart.AIReport) {
      doc.setFontSize(14);
      doc.text("AI Generated Summary:", 14, yOffset + 10);

      doc.setFontSize(11);
      const summaryLines = doc.splitTextToSize(chart.AIReport, 180);
      doc.text(summaryLines, 14, yOffset + 20);
      yOffset += 20 + summaryLines.length * 6;
    }

    const fields = chart.config?.fields || Object.keys(chart.data?.[0] || {});
    const body = chart.data.map((row) => fields.map((f) => row[f] ?? "—"));

    autoTable(doc, {
      startY: yOffset + 10,
      head: [fields],
      body,
      styles: { fontSize: 8 },
    });

    doc.save(`${chart.title || "chart"}-report.pdf`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-2 py-0 bg-amber-600 text-white rounded hover:bg-amber-500"
        >
          ⬅ Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 border border-[var(--border)] rounded shadow bg-[var(--card)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2 bg-[var(--card)] rounded-t">
            <div className="flex space-x-2">
              {["Chart", "Data Table"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-500"
                      : "hover:text-blue-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-center flex-1">
              {chart.title}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadImage}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-purple-600 text-white rounded hover:bg-purple-500"
                disabled={!ready}
              >
                ⬇ Image
              </button>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-500"
                disabled={!ready}
              >
                ⬇ PDF
              </button>
            </div>
          </div>

          <div className="p-4">
            {activeTab === "Chart" && (
              <div className="space-y-4">
                <div className="border border-[var(--border)] rounded p-4">
                  <ChartCard
                    chart={chart}
                    index={0}
                    rows={chart.data}
                    readOnly
                    canvasRef={canvasRef}
                  />
                </div>
                {!ready && (
                  <p className="text-gray-500">
                    Preparing chart... Please wait.
                  </p>
                )}
              </div>
            )}

            {activeTab === "Data Table" && (
              <div className="overflow-x-auto border border-[var(--border)] rounded">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      {Object.keys(chart.data?.[0] || {}).map((col) => (
                        <th
                          key={col}
                          className="border px-3 py-1 text-left font-medium bg-[var(--border)]"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.data?.map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--border)]">
                        {Object.keys(row).map((col) => (
                          <td key={col} className="border px-3 py-1">
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="p-4 border rounded bg-[var(--card)]">
            <h3 className="text-lg font-semibold mb-2">Chart Information</h3>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Title:</strong> {chart.title || "Untitled Chart"}
              </li>
              <li>
                <strong>Type:</strong> {chart.type || "Unknown"}
              </li>
              <li>
                <strong>X-Axis:</strong>{" "}
                {chart.config?.xAxis || "Not specified"}
              </li>
              <li>
                <strong>Y-Axis:</strong>{" "}
                {Array.isArray(chart.config?.yAxis)
                  ? chart.config.yAxis.join(", ")
                  : typeof chart.config?.yAxis === "string"
                  ? chart.config.yAxis
                  : "Not specified"}
              </li>
              <li>
                <strong>Data Rows:</strong> {chart.data?.length ?? 0}
              </li>
              <li>
                <strong>Created:</strong>{" "}
                {chart.createdAt
                  ? new Date(chart.createdAt).toLocaleString()
                  : "N/A"}
              </li>
              <li>
                <strong>Saved:</strong> {chart.saved ? "Yes" : "No"}
              </li>
              <li>
                <strong>Description:</strong>{" "}
                {chart.description || "No description provided."}
              </li>
            </ul>
          </div>

          <ChartSummary chart={chart} onSummarySaved={refreshChartFromServer} />
        </aside>
      </div>
    </div>
  );
};

export default ChartDetail;
