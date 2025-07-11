import React, { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { getSavedChart } from "../services/AuthAPI";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ChartCard from "./ChartUploads/ChartCard";
import JSZip from "jszip";

const ReportComponent = () => {
  const { filename } = useParams();
  const { fileData } = useOutletContext();
  const navigate = useNavigate();

  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [preparationError, setPreparationError] = useState("");

  const chartRefs = useRef({});
console.log('this is reposcompinet pafe ', charts);

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

  // Reusable canvas wait logic
  const waitForCanvases = async (
    selectedIds,
    timeout = 5000,
    interval = 200
  ) => {
    let waited = 0;
    while (true) {
      const allReady = selectedIds.every(
        (id) => chartRefs.current[id]?.current
      );
      if (allReady) return true;
      if (waited >= timeout) return false;
      await new Promise((r) => setTimeout(r, interval));
      waited += interval;
    }
  };

  const handleDownloadPDF = async () => {
    setPreparationError("");
    setGeneratingPDF(true);

    const ready = await waitForCanvases(selectedCharts);
    if (!ready) {
      setGeneratingPDF(false);
      setPreparationError(
        "Some charts could not be prepared. Please wait a moment after selecting before downloading."
      );
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Report: ${fileData.fileName}`, 14, 20);

    let yOffset = 30;
    const pageHeight = doc.internal.pageSize.getHeight();

    for (const chartId of selectedCharts) {
      const chart = filteredCharts.find((c) => c.chartId === chartId);
      const canvas = chartRefs.current[chartId]?.current;
      const dataUrl = canvas?.toDataURL("image/png");

      if (!chart || !dataUrl) continue;

      const estimatedHeight = 90 + (chart.AIReport ? 50 : 0); // basic estimate

      if (yOffset + estimatedHeight > pageHeight - 20) {
        doc.addPage();
        yOffset = 20;
      }

      doc.setFontSize(14);
      doc.text(chart.title || `Chart - ${chartId}`, 15, yOffset);
      yOffset += 8;

      doc.addImage(dataUrl, "PNG", 15, yOffset, 180, 80);
      yOffset += 90;

      if (chart.AIReport) {
        doc.setFontSize(12);
        doc.text("AI Generated Summary:", 15, yOffset + 6);
        const summaryLines = doc.splitTextToSize(chart.AIReport, 180);
        doc.setFontSize(10);

        if (yOffset + 14 + summaryLines.length * 5 > pageHeight - 20) {
          doc.addPage();
          yOffset = 20;
          doc.setFontSize(12);
          doc.text("AI Generated Summary:", 15, yOffset);
          yOffset += 6;
        } else {
          yOffset += 14;
        }

        doc.text(summaryLines, 15, yOffset);
        yOffset += summaryLines.length * 5;
      }

      yOffset += 10; // spacing before next chart
    }

    // Add Data Table
    if (yOffset + 30 > pageHeight - 20) {
      doc.addPage();
      yOffset = 20;
    }

    const fieldsSet = new Set();
    selectedCharts.forEach((chartId) => {
      const chart = filteredCharts.find((c) => c.chartId === chartId);
      if (chart?.config?.xAxis) fieldsSet.add(chart.config.xAxis);
      if (chart?.config?.yAxis) fieldsSet.add(chart.config.yAxis);
    });

    const fields =
      Array.from(fieldsSet).length > 0
        ? Array.from(fieldsSet)
        : Object.keys(fileData.rows[0] || {});

    const body = fileData.rows.map((row) => fields.map((f) => row[f] ?? "—"));

    autoTable(doc, {
      startY: yOffset + 10,
      head: [fields],
      body,
      styles: { fontSize: 8 },
    });

    doc.save(`${fileData.fileName}-report.pdf`);
    setGeneratingPDF(false);
  };
  
  

  const handleDownloadImagesZip = async () => {
    setPreparationError("");
    setGeneratingImg(true);

    const ready = await waitForCanvases(selectedCharts);
    if (!ready) {
      setGeneratingImg(false);
      setPreparationError(
        "Some charts could not be prepared. Please wait a moment after selecting before downloading."
      );
      return;
    }

    // If only one chart is selected, download directly as .png
    if (selectedCharts.length === 1) {
      const chartId = selectedCharts[0];
      const chart = filteredCharts.find((c) => c.chartId === chartId);
      const canvas = chartRefs.current[chartId]?.current;
      const dataUrl = canvas?.toDataURL("image/png");
      if (!dataUrl) {
        setGeneratingImg(false);
        return;
      }

      const fileName = `${(chart.title || "chart")
        .replace(/\s+/g, "_")
        .toLowerCase()}.png`;

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      link.click();

      setGeneratingImg(false);
      return;
    }

    // If multiple charts selected, prepare ZIP
    const zip = new JSZip();
    const folder = zip.folder("charts");

    for (const [index, chartId] of selectedCharts.entries()) {
      const chart = filteredCharts.find((c) => c.chartId === chartId);
      const canvas = chartRefs.current[chartId]?.current;
      const dataUrl = canvas?.toDataURL("image/png");
      if (!dataUrl) continue;

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      const fileName = `${index + 1}_${(chart.title || "chart")
        .replace(/\s+/g, "_")
        .toLowerCase()}.png`;

      folder.file(fileName, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${fileData.fileName}-charts.zip`;
    link.click();

    setGeneratingImg(false);
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

      {preparationError && (
        <div className="text-red-600 font-semibold">{preparationError}</div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Chart Previews</h3>
        {selectedCharts.length === 0 ? (
          <p className="text-gray-500">No charts selected.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {selectedCharts.map((chartId) => {
              const chart = filteredCharts.find((c) => c.chartId === chartId);
              if (!chart) return null;
              if (!chartRefs.current[chartId]) {
                chartRefs.current[chartId] = React.createRef();
              }
              return (
                <div
                  key={chartId}
                  className="relative border border-[var(--border)] rounded p-2"
                >
                  <button
                    onClick={() =>
                      setSelectedCharts((prev) =>
                        prev.filter((id) => id !== chartId)
                      )
                    }
                    className="absolute top-2 z-10 right-2 text-red-500 hover:text-red-700"
                    title="Remove chart"
                  >
                    ❌
                  </button>

                  <ChartCard
                    chart={chart}
                    index={chartId}
                    rows={fileData.rows}
                    readOnly
                    canvasRef={chartRefs.current[chartId]}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Saved Charts</h3>
        {loading ? (
          <p>Loading saved charts...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <button
              className="mb-2 text-sm text-blue-600 underline"
              onClick={() => {
                if (selectedCharts.length === filteredCharts.length) {
                  setSelectedCharts([]);
                } else {
                  setSelectedCharts(filteredCharts.map((c) => c.chartId));
                }
              }}
            >
              {selectedCharts.length === filteredCharts.length
                ? "Deselect All"
                : "Select All"}
            </button>

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
                    <tr
                      key={chart.chartId}
                      className="hover:bg-[var(--border)]"
                    >
                      <td className="px-4 py-2 border text-center">
                        <input
                          type="checkbox"
                          checked={selectedCharts.includes(chart.chartId)}
                          onChange={(e) => {
                            const newSelection = e.target.checked
                              ? [...selectedCharts, chart.chartId]
                              : selectedCharts.filter(
                                  (id) => id !== chart.chartId
                                );
                            setSelectedCharts(newSelection);
                            setPreparationError("");
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
          </>
        )}
      </div>

      {selectedCharts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handleDownloadPDF}
            disabled={generatingPDF}
            className={`px-4 py-2 rounded ${
              generatingPDF
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            {generatingPDF ? "Generating PDF..." : "Download PDF Report"}
          </button>

          <button
            onClick={handleDownloadImagesZip}
            disabled={generatingImg}
            className={`px-4 py-2 rounded ${
              generatingImg
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500 text-white"
            }`}
          >
            {generatingImg ? "Preparing ZIP..." : "Download Images ZIP"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportComponent;
