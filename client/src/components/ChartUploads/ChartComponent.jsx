import { useParams, useNavigate, useOutletContext, Navigate } from "react-router-dom";
import { useState } from "react";
import ChartCard from "./ChartCard";
import { saveCharts } from "../../services/AuthAPI";
import ChartPreview from "./ChartPreview";

const ChartComponent = () => {
  // Make sure param name matches your Route
  const { filename } = useParams();
  const navigate = useNavigate();

  const { fileData, isMobile, previewChart, setPreviewChart } =
    useOutletContext();

  const [charts, setCharts] = useState([
    { id: 1, title: "Chart 1", xAxis: "", yAxis: "", graphType: "bar" },
  ]);
  const [savedIndexes, setSavedIndexes] = useState([]);

  const columns = fileData?.rows?.length ? Object.keys(fileData.rows[0]) : [];

  const updateChart = (index, key, value) => {
    const updated = [...charts];
    updated[index][key] = value;
    setCharts(updated);
  };

  const handleRemove = (indexToRemove) => {
    setCharts((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  function generateChartId() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `chart-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  const handleSave = async (chart, index) => {
    try {
      const payload = {
        charts: [
          {
            chartId: generateChartId(),
            title: chart.title,
            type: chart.graphType,
            uploadedFile: fileData._id,
            config: {
              xAxis: chart.xAxis,
              yAxis: chart.yAxis,
            },
            saved: true,
          },
        ],
      };

      const res = await saveCharts(payload);
      console.log("Chart saved:", res.data);
      setSavedIndexes((prev) => [chart.id, ...prev]);
      alert("Chart saved successfully!");
    } catch (error) {
      console.error("Save failed:", error.response?.data || error.message);
      alert("Failed to save chart.");
    }
  };

  return (
    <>
        <h2 className="text-2xl font-bold text-center mb-6">
          Chart for file: {filename}
        </h2>

        <div className="flex justify-between">
          <button
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded transition"
            onClick={() =>
              setCharts((prev) => [
                {
                  id: Date.now(),
                  title: "New Chart",
                  xAxis: "",
                  yAxis: "",
                  graphType: "bar",
                },
                ...prev,
              ])
            }
          >
            <span className="text-lg leading-none">＋</span>
            Add Chart
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-[var(--card)] hover:bg-amber-500 px-3 py-1 border border-amber-500 rounded transition"
            onClick={() =>
              navigate(`/upload/chart/${filename}/report`, {
                state: { fileData: fileData },
              })
            }
          >
            <span className="text-lg leading-none">＋</span>
            Report
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {charts.map((chart, index) => (
            <div
              key={chart.id}
              className="
                flex-1
                min-w-[250px] max-w-full
                sm:min-w-[400px] sm:max-w-[500px]
                md:min-w-[500px] md:max-w-[600px]
              "
            >
              <ChartCard
                chart={chart}
                index={index}
                columns={columns}
                updateChart={updateChart}
                rows={fileData?.rows || []}
                handleRemove={handleRemove}
                isMobile={isMobile}
                handleSave={(chart) => handleSave(chart, index)}
                disabled={savedIndexes.includes(chart.id)}
              />
            </div>
          ))}
        </div>
        <ChartPreview
          chart={previewChart}
          rows={fileData?.rows || []}
          onClose={() => setPreviewChart(null)}
        />
    </>
  );
};

export default ChartComponent;
