import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getSavedChart } from "../services/AuthAPI";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Chart from "chart.js/auto";

const ReportComponent = () => {
  const { filename } = useParams();
  const { fileData } = useOutletContext();
  const navigate = useNavigate();

  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCharts, setSelectedCharts] = useState([]);

  const chartRefs = useRef({});
  const chartInstances = useRef({});

  // Fetch saved charts
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await getSavedChart();
        setCharts(response.data || []);
      } catch (err) {
        console.error("Error fetching charts:", err);
        setError("Failed to load charts.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, []);

  const filteredCharts = charts.filter(
    (chart) => chart.uploadedFile === fileData?._id
  );

  // Generate all charts when selection changes
  useEffect(() => {
    if (!fileData || !fileData.rows) return;

    // Destroy previous chart instances
    Object.values(chartInstances.current).forEach((instance) =>
      instance.destroy()
    );
    chartInstances.current = {};

    // For each selected chart, create chart
    selectedCharts.forEach((chartId) => {
      const canvas = chartRefs.current[chartId];
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      const selectedChart = filteredCharts.find((c) => c.chartId === chartId);
      if (!selectedChart) return;

      const { xAxis, yAxis, type } = selectedChart.config || {};
      if (!xAxis || !yAxis) return;

      const labels = [];
      const data = [];
      fileData.rows.forEach((row) => {
        const xVal = row[xAxis];
        const yVal = parseFloat(row[yAxis]);
        if (xVal != null && !isNaN(yVal)) {
          labels.push(xVal);
          data.push(yVal);
        }
      });

      chartInstances.current[chartId] = new Chart(ctx, {
        type: type || "bar",
        data: {
          labels,
          datasets: [
            {
              label: `${yAxis} vs ${xAxis}`,
              data,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            legend: { display: true },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    });
  }, [fileData, selectedCharts]);

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Report: ${fileData.fileName}`, 14, 20);

    let yOffset = 30;

    // Loop over each selected chart to add images
    for (const chartId of selectedCharts) {
      const canvas = chartRefs.current[chartId];
      if (!canvas) continue;
      const dataUrl = canvas.toDataURL("image/png");
      if (dataUrl) {
        doc.addImage(dataUrl, "PNG", 15, yOffset, 180, 80);
        yOffset += 90;
      }
    }

    // Get selected chart configs
    const selected = filteredCharts.filter((c) =>
      selectedCharts.includes(c.chartId)
    );

    // Gather unique fields
    const fieldsSet = new Set();
    selected.forEach((c) => {
      if (c.config?.xAxis) fieldsSet.add(c.config.xAxis);
      if (c.config?.yAxis) fieldsSet.add(c.config.yAxis);
    });
    const fields = Array.from(fieldsSet);

    // Build table body data
    const body = fileData.rows.map((row) =>
      fields.map((field) => row[field] ?? "—")
    );

    // Add dynamic data table
    autoTable(doc, {
      startY: yOffset + 10,
      head: [fields],
      body,
    });

    doc.save(`${fileData.fileName}-report.pdf`);
  };
  

  if (!fileData) {
    return (
      <div className="p-6 text-red-600">
        <p>Error: File data is missing. Please re-upload the file.</p>
        <button
          onClick={() => navigate("/upload")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--card)] rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Report for File: {fileData.fileName}
      </h2>

      <button
        onClick={() =>
          navigate(`/upload/chart/${filename}`, { state: { fileData } })
        }
        className="mb-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded"
      >
        Back to Charts
      </button>

      {/* Chart Preview */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Chart Previews</h3>
        {selectedCharts.length === 0 ? (
          <p className="text-gray-500">No charts selected.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {selectedCharts.map((chartId) => (
              <canvas
                key={chartId}
                ref={(el) => (chartRefs.current[chartId] = el)}
                width={600}
                height={300}
                style={{ background: "white", borderRadius: "8px" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Saved Charts */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Saved Charts</h3>
        {loading ? (
          <p>Loading saved charts...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-sm">
              <thead className="bg-[var(--border)]">
                <tr>
                  <th className="px-4 py-2 border">Select</th>
                  <th className="px-4 py-2 border">Chart Title</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">X Axis</th>
                  <th className="px-4 py-2 border">Y Axis</th>
                </tr>
              </thead>
              <tbody>
                {filteredCharts.map((chart) => (
                  <tr key={chart.chartId} className="hover:bg-[var(--border)]">
                    <td className="px-4 py-2 border text-center">
                      <input
                        type="checkbox"
                        checked={selectedCharts.includes(chart.chartId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCharts((prev) => [
                              ...prev,
                              chart.chartId,
                            ]);
                          } else {
                            setSelectedCharts((prev) =>
                              prev.filter((id) => id !== chart.chartId)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-2 border">{chart.title}</td>
                    <td className="px-4 py-2 border">{chart.type}</td>
                    <td className="px-4 py-2 border">
                      {chart.config?.xAxis || "—"}
                    </td>
                    <td className="px-4 py-2 border">
                      {chart.config?.yAxis || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCharts.length > 0 && (
        <div className="text-sm">
          <strong>Selected Charts:</strong> {selectedCharts.join(", ")}
        </div>
      )}

      <button
        onClick={handleDownloadPDF}
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded"
      >
        Download PDF Report
      </button>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">File Data (Raw JSON)</h3>
        <pre className="bg-[var(--border)] p-4 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(fileData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ReportComponent;
