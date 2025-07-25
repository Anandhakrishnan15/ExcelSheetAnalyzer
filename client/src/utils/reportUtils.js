import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import jsPDF from "jspdf";
import { incrementDownload } from "../services/AuthAPI";
import autoTable from "jspdf-autotable";

// ✅ Register once globally
Chart.register(ChartDataLabels);

// Wait until all chartRefs are ready
export const waitForCanvases = async (selectedIds, chartRefs, timeout = 5000, interval = 200) => {
    let waited = 0;
    while (true) {
        const allReady = selectedIds.every((id) => chartRefs.current[id]?.current);
        if (allReady) return true;
        if (waited >= timeout) return false;
        await new Promise((r) => setTimeout(r, interval));
        waited += interval;
    }
};

export const renderChartToImageBlob = async (chartData, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    const isArea = chartData.type === "area";
    const isPieOrDonut = chartData.type === "pie" || chartData.type === "doughnut";

    const chartInstance = new Chart(ctx, {
        type: isArea ? "line" : chartData.type,
        data: {
            labels: chartData.data.map((item) => item[chartData.config.xAxis]),
            datasets: chartData.config.yAxis.map((yKey, i) => ({
                label: yKey,
                data: chartData.data.map((item) => item[yKey]),
                backgroundColor: isPieOrDonut
                    ? chartData.data.map((_, j) => `hsl(${(j * 360) / chartData.data.length}, 70%, 60%)`)
                    : `hsla(${i * 60}, 70%, 50%, ${isArea ? 0.4 : 0.2})`,
                borderColor: isPieOrDonut ? "#fff" : `hsl(${i * 60}, 70%, 50%)`,
                borderWidth: isPieOrDonut ? 1 : 2,
                fill: isArea,
                tension: isArea ? 0.4 : 0,
                pointRadius: isArea ? 0 : 3,
            })),
        },
        options: {
            responsive: false,
            animation: false,
            plugins: {
                legend: { position: "top" },
                title: {
                    display: true,
                    text: chartData.title || `Chart ${index + 1}`,
                },
                datalabels: isPieOrDonut
                    ? {
                        formatter: (value, context) => {
                            const data = context.chart.data.datasets[0].data;
                            const total = data.reduce((sum, val) => sum + val, 0);
                            const percent = ((value / total) * 100).toFixed(1);
                            return `${percent}%`;
                        },
                        color: "#fff",
                        font: { weight: "bold" },
                    }
                    : false,
            },
            scales: isPieOrDonut
                ? {}
                : {
                    x: { title: { display: true, text: chartData.config.xAxis } },
                    y: {
                        title: { display: true, text: chartData.config.yAxis.join(", ") },
                    },
                },
        },
        plugins: isPieOrDonut ? [ChartDataLabels] : [],
    });

    await new Promise((r) => setTimeout(r, 200));

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            chartInstance.destroy();
            resolve(blob);
        }, "image/png");
    });
};

export const blobToDataURL = (blob) =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });

export const downloadSingleChartPDF = async (chart) => {
    const blob = await renderChartToImageBlob(chart, 0);
    if (!blob) {
        alert("Failed to render chart.");
        return;
    }

    const dataUrl = await blobToDataURL(blob);
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 40;
    const usableWidth = pageWidth - marginX * 2;
    const imageWidth = 500;
    const imageHeight = 300;
    const imageY = 100;
    let yOffset = imageY + imageHeight + 30;

    const safeTitle = chart.title?.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_") || "chart";

    // Title and Timestamp
    doc.setFontSize(18);
    doc.text(`Report: ${chart.title || "Untitled Chart"}`, marginX, 60);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - marginX, 60, { align: "right" });

    // Chart Image (centered)
    const imageX = (pageWidth - imageWidth) / 2;
    doc.addImage(dataUrl, "PNG", imageX, imageY, imageWidth, imageHeight);

    // AI Summary
    if (chart.AIReport) {
        const summaryLines = doc.splitTextToSize(chart.AIReport, usableWidth);

        if (yOffset + summaryLines.length * 14 > pageHeight - 40) {
            doc.addPage();
            yOffset = 60;
        }

        doc.setFontSize(12);
        doc.text("AI Generated Summary:", marginX, yOffset);
        yOffset += 20;

        doc.setFontSize(10);
        doc.text(summaryLines, marginX, yOffset);
        yOffset += summaryLines.length * 14 + 30;
    }

    // Original Data Table

    const rows = chart.data?.map((row) => Object.values(row)) || [];
    const columns = chart.data?.[0] ? Object.keys(chart.data[0]) : [];

    if (rows.length && columns.length) {
        if (yOffset + 100 > pageHeight - 40) {
            doc.addPage();
            yOffset = 60;
        }

        autoTable(doc, {
            startY: yOffset,
            head: [columns],
            body: rows,
            styles: { fontSize: 8 },
            margin: { left: marginX, right: marginX },
            headStyles: { fillColor: [41, 128, 185] },
        });
    } else {
        doc.setFontSize(10);
        doc.text("No data available to display.", marginX, yOffset);
    }


    // Page numbers (optional)
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - marginX, pageHeight - 20, { align: "right" });
    }

    // Download tracking
    try {
        await incrementDownload({ chartId: chart.chartId, type: "pdf" });
    } catch (err) {
        console.error("Failed to increment PDF download:", err);
    }

    // Save
    doc.save(`${safeTitle}.pdf`);
};
