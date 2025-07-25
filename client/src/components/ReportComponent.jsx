// This is the recomposed ReportComponent using modular structure

import React, { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { getSavedChart, incrementDownload } from "../services/AuthAPI";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { toast } from "react-toastify";

import ChartPreviewList from "./ReportParts/ChartPreviewList";
import SavedChartsTable from "./ReportParts/SavedChartsTable";
import DownloadButtons from "./ReportParts/DownloadButtons";
import {
  waitForCanvases,
  renderChartToImageBlob,
  blobToDataURL,
} from "../utils/reportUtils";

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

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await getSavedChart();
        setCharts(response.data || []);
      } catch (err) {
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

  const refreshChartFromServer = async (chartId) => {
    try {
      const res = await getSavedChart();
      const updatedChart = res.data.find((c) => c.chartId === chartId);
      if (updatedChart) {
        setCharts((prevCharts) =>
          prevCharts.map((chart) =>
            chart.chartId === chartId ? updatedChart : chart
          )
        );
      }
    } catch (err) {
      console.error("Failed to refresh chart:", err);
    }
  };

  const handleDownloadPDF = async () => {
    setPreparationError("");
    setGeneratingPDF(true);

    const ready = await waitForCanvases(selectedCharts, chartRefs);
    if (!ready) {
      setGeneratingPDF(false);
      setPreparationError(
        "Some charts could not be prepared. Please wait a moment after selecting before downloading."
      );
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 40;
    const usableWidth = pageWidth - marginX * 2;

    // Title + Timestamp
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text(`Report: ${fileData.fileName}`, marginX, 60);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      pageWidth - marginX,
      60,
      { align: "right" }
    );

    let yOffset = 90;

    for (let index = 0; index < selectedCharts.length; index++) {
      const chartId = selectedCharts[index];
      const chart = filteredCharts.find((c) => c.chartId === chartId);
      if (!chart) continue;

      const blob = await renderChartToImageBlob(chart, index);
      if (!blob) continue;

      const dataUrl = await blobToDataURL(blob);

      // Chart Title
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text(chart.title || `Chart - ${chartId}`, marginX, yOffset);
      yOffset += 20;
      doc.setFont(undefined, "normal");

      // Chart Image
      const imageWidth = 500;
      const imageHeight = 280;
      const imageX = (pageWidth - imageWidth) / 2;

      if (yOffset + imageHeight + 20 > pageHeight - 40) {
        doc.addPage();
        yOffset = 60;
      }

      doc.addImage(dataUrl, "PNG", imageX, yOffset, imageWidth, imageHeight);
      yOffset += imageHeight + 20;

      // Pie/Doughnut Table Breakdown
      if (chart.chartType === "pie" || chart.chartType === "doughnut") {
        const labels = chart.config?.labels || [];
        const values = chart.config?.data || [];
        const total = values.reduce((sum, val) => sum + Number(val), 0);

        const breakdown = labels.map((label, i) => [
          label,
          values[i],
          `${((values[i] / total) * 100).toFixed(1)}%`,
        ]);

        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text("Percentage Breakdown:", marginX, yOffset);
        yOffset += 10;

        doc.setFont(undefined, "normal");
        autoTable(doc, {
          startY: yOffset,
          head: [["Label", "Value", "%"]],
          body: breakdown,
          styles: { fontSize: 9 },
          margin: { left: marginX, right: marginX },
        });

        yOffset = doc.lastAutoTable.finalY + 20;
      }

      // AI Summary
      if (chart.AIReport) {
        const summaryTitle = "AI Generated Summary:";
        const summaryParagraphs = chart.AIReport.split(/\n\s*\n/);

        if (yOffset + 100 > pageHeight - 40) {
          doc.addPage();
          yOffset = 60;
        }

        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text(summaryTitle, marginX, yOffset);
        yOffset += 20;

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");

        for (let para of summaryParagraphs) {
          const lines = doc.splitTextToSize(para.trim(), usableWidth);
          for (let line of lines) {
            if (yOffset > pageHeight - 40) {
              doc.addPage();
              yOffset = 60;
            }
            doc.text(line, marginX, yOffset);
            yOffset += 14;
          }
          yOffset += 10; // space between paragraphs
        }
      }

      // Track download
      try {
        await incrementDownload({ chartId: chart.chartId, type: "pdf" });
      } catch (err) {
        console.error(
          `Failed to increment PDF download for chart ${chart.chartId}:`,
          err
        );
      }

      if (
        yOffset + 200 > pageHeight - 40 &&
        index < selectedCharts.length - 1
      ) {
        doc.addPage();
        yOffset = 60;
      }
    }

    // Final Data Table
    if (fileData?.rows?.length) {
      const fieldsSet = new Set();
      selectedCharts.forEach((chartId) => {
        const chart = filteredCharts.find((c) => c.chartId === chartId);
        if (chart?.config?.xAxis) fieldsSet.add(chart.config.xAxis);
        if (chart?.config?.yAxis) {
          const yAxes = Array.isArray(chart.config.yAxis)
            ? chart.config.yAxis
            : [chart.config.yAxis];
          yAxes.forEach((axis) => fieldsSet.add(axis));
        }
      });

      const fields =
        fieldsSet.size > 0
          ? Array.from(fieldsSet)
          : Object.keys(fileData.rows[0] || {});
      const body = fileData.rows.map((row) => fields.map((f) => row[f] ?? "—"));

      if (yOffset + 100 > pageHeight - 40) {
        doc.addPage();
        yOffset = 60;
      }

      doc.setFont(undefined, "bold");
      doc.setFontSize(12);
      doc.text("Source Data Table:", marginX, yOffset);
      yOffset += 10;
      doc.setFont(undefined, "normal");

      autoTable(doc, {
        startY: yOffset,
        head: [fields],
        body,
        styles: { fontSize: 8 },
        margin: { left: marginX, right: marginX },
        headStyles: { fillColor: [41, 128, 185] },
      });
    } else {
      doc.setFontSize(10);
      doc.text("No data available to display.", marginX, yOffset);
    }

    // Page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - marginX,
        pageHeight - 20,
        { align: "right" }
      );
    }

    doc.save(`${fileData.fileName?.replace(/\s+/g, "_") || "report"}.pdf`);
    setGeneratingPDF(false);
    toast.success("PDF downloaded successfully!");
  };


// const handleDownloadPDF = async () => {
//   setPreparationError("");
//   setGeneratingPDF(true);

//   const ready = await waitForCanvases(selectedCharts, chartRefs);
//   if (!ready) {
//     setGeneratingPDF(false);
//     setPreparationError(
//       "Some charts could not be prepared. Please wait a moment after selecting before downloading."
//     );
//     return;
//   }

//   const doc = new jsPDF({ unit: "pt", format: "a4" });
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const marginX = 40;
//   const usableWidth = pageWidth - marginX * 2;

//   // Title + Timestamp
//   doc.setFontSize(18);
//   doc.text(`Report: ${fileData.fileName}`, marginX, 60);
//   doc.setFontSize(10);
//   doc.text(
//     `Generated: ${new Date().toLocaleString()}`,
//     pageWidth - marginX,
//     60,
//     { align: "right" }
//   );

//   let yOffset = 90;

//   for (let index = 0; index < selectedCharts.length; index++) {
//     const chartId = selectedCharts[index];
//     const chart = filteredCharts.find((c) => c.chartId === chartId);
//     if (!chart) continue;

//     const blob = await renderChartToImageBlob(chart, index);
//     if (!blob) continue;

//     const dataUrl = await blobToDataURL(blob);

//     // Title
//     doc.setFontSize(14);
//     doc.text(chart.title || `Chart - ${chartId}`, marginX, yOffset);
//     yOffset += 20;

//     // Chart image
//     const imageWidth = 500;
//     const imageHeight = 280;
//     const imageX = (pageWidth - imageWidth) / 2;

//     if (yOffset + imageHeight + 20 > pageHeight - 40) {
//       doc.addPage();
//       yOffset = 60;
//     }

//     doc.addImage(dataUrl, "PNG", imageX, yOffset, imageWidth, imageHeight);
//     yOffset += imageHeight + 20;

//     // Pie/Doughnut Breakdown
//     if (chart.chartType === "pie" || chart.chartType === "doughnut") {
//       const labels = chart.config?.labels || [];
//       const values = chart.config?.data || [];
//       const total = values.reduce((sum, val) => sum + Number(val), 0);

//       const breakdown = labels.map((label, i) => [
//         label,
//         values[i],
//         `${((values[i] / total) * 100).toFixed(1)}%`,
//       ]);

//       doc.setFontSize(12);
//       doc.text("Percentage Breakdown:", marginX, yOffset);
//       yOffset += 10;

//       autoTable(doc, {
//         startY: yOffset,
//         head: [["Label", "Value", "%"]],
//         body: breakdown,
//         styles: { fontSize: 9 },
//         margin: { left: marginX, right: marginX },
//       });

//       yOffset = doc.lastAutoTable.finalY + 20;
//     }

//     // AI Summary
//     if (chart.AIReport) {
//       const summaryLines = doc.splitTextToSize(chart.AIReport, usableWidth);

//       if (yOffset + summaryLines.length * 14 > pageHeight - 40) {
//         doc.addPage();
//         yOffset = 60;
//       }

//       doc.setFontSize(12);
//       doc.text("AI Generated Summary:", marginX, yOffset);
//       yOffset += 20;

//       doc.setFontSize(10);
//       doc.text(summaryLines, marginX, yOffset);
//       yOffset += summaryLines.length * 14 + 20;
//     }

//     // Track chart download
//     try {
//       await incrementDownload({ chartId: chart.chartId, type: "pdf" });
//     } catch (err) {
//       console.error(
//         `Failed to increment PDF download for chart ${chart.chartId}:`,
//         err
//       );
//     }

//     // Page break if nearing bottom
//     if (yOffset + 200 > pageHeight - 40 && index < selectedCharts.length - 1) {
//       doc.addPage();
//       yOffset = 60;
//     }
//   }

//   // === Final Data Table (from fileData) ===
//   if (fileData?.rows?.length) {
//     const fieldsSet = new Set();

//     selectedCharts.forEach((chartId) => {
//       const chart = filteredCharts.find((c) => c.chartId === chartId);
//       if (chart?.config?.xAxis) fieldsSet.add(chart.config.xAxis);
//       if (chart?.config?.yAxis) {
//         const yAxes = Array.isArray(chart.config.yAxis)
//           ? chart.config.yAxis
//           : [chart.config.yAxis];
//         yAxes.forEach((axis) => fieldsSet.add(axis));
//       }
//     });

//     const fields =
//       fieldsSet.size > 0
//         ? Array.from(fieldsSet)
//         : Object.keys(fileData.rows[0] || {});
//     const body = fileData.rows.map((row) => fields.map((f) => row[f] ?? "—"));

//     if (yOffset + 100 > pageHeight - 40) {
//       doc.addPage();
//       yOffset = 60;
//     }

//     autoTable(doc, {
//       startY: yOffset,
//       head: [fields],
//       body,
//       styles: { fontSize: 8 },
//       margin: { left: marginX, right: marginX },
//       headStyles: { fillColor: [41, 128, 185] },
//     });
//   } else {
//     doc.setFontSize(10);
//     doc.text("No data available to display.", marginX, yOffset);
//   }

//   // Optional: Add page numbers
//   const pageCount = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= pageCount; i++) {
//     doc.setPage(i);
//     doc.setFontSize(9);
//     doc.text(
//       `Page ${i} of ${pageCount}`,
//       pageWidth - marginX,
//       pageHeight - 20,
//       { align: "right" }
//     );
//   }

//   doc.save(`${fileData.fileName?.replace(/\s+/g, "_") || "report"}.pdf`);
//   setGeneratingPDF(false);
//   toast.success("PDF downloaded successfully!");
// };


const handleDownloadImagesZip = async () => {
  setPreparationError("");
  setGeneratingImg(true);

  const ready = await waitForCanvases(selectedCharts, chartRefs);
  if (!ready) {
    setGeneratingImg(false);
    setPreparationError(
      "Some charts could not be prepared. Please wait a moment after selecting before downloading."
    );
    return;
  }

  if (selectedCharts.length === 1) {
    const chartId = selectedCharts[0];
    const chart = filteredCharts.find((c) => c.chartId === chartId);

    if (!chart) {
      setGeneratingImg(false);
      toast.error("Chart not found.");
      return;
    }

    const blob = await renderChartToImageBlob(chart, 0);
    const fileName = `${(chart.title || "chart")
      .replace(/\s+/g, "_")
      .toLowerCase()}.png`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    try {
      await incrementDownload({ chartId: chart.chartId, type: "image" });
      toast.success("Image downloaded");
    } catch (error) {
      console.error("Failed to update download count:", error);
      toast.error("Download count update failed.");
    }

    setGeneratingImg(false);
    return;
  }

  // Multiple chart download – ZIP creation
  const zip = new JSZip();
  const folder = zip.folder("charts");

  for (const [index, chartId] of selectedCharts.entries()) {
    const chart = filteredCharts.find((c) => c.chartId === chartId);
    if (!chart) continue;

    const blob = await renderChartToImageBlob(chart, index);
    if (!blob) continue;

    const fileName = `${index + 1}_${(chart.title || "chart")
      .replace(/\s+/g, "_")
      .toLowerCase()}.png`;

    folder.file(fileName, blob);

    try {
      await incrementDownload({ chartId: chart.chartId, type: "image" });
    } catch (error) {
      console.error(`Download count update failed for ${chart.title}:`, error);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = `${fileData.fileName}-charts.zip`;
  link.click();

  setGeneratingImg(false);
  toast.success("All chart images downloaded as ZIP!");
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
        <ChartPreviewList
          selectedCharts={selectedCharts}
          filteredCharts={filteredCharts}
          chartRefs={chartRefs}
          fileData={fileData}
          setSelectedCharts={setSelectedCharts}
          refreshChartFromServer={refreshChartFromServer}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Saved Charts</h3>
        <SavedChartsTable
          filteredCharts={filteredCharts}
          selectedCharts={selectedCharts}
          setSelectedCharts={setSelectedCharts}
          loading={loading}
          error={error}
        />
      </div>

      {selectedCharts.length > 0 && (
        <DownloadButtons
          handleDownloadPDF={handleDownloadPDF}
          handleDownloadImagesZip={handleDownloadImagesZip}
          generatingPDF={generatingPDF}
          generatingImg={generatingImg}
        />
      )}
    </div>
  );
};

export default ReportComponent;
