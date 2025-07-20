import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import ChartDetailMain from "../components/ChartDetail/ChartDetailMain";
import ChartDetailInfo from "../components/ChartDetail/ChartDetailInfo";
import { getSavedChart, incrementDownload } from "../services/AuthAPI";

const ChartDetail = () => {
  const { chartId } = useParams();
  const navigate = useNavigate();

  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("Chart");

  const canvasRef = useRef();

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await getSavedChart();
        const found = res.data.find((c) => c.chartId === chartId);
        if (!found) {
          alert("Chart not found. Redirecting...");
          navigate("/upload");
          return;
        }
        setChart(found);
        setTimeout(() => setReady(true), 500);
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

  const refreshChartFromServer = async () => {
    try {
      const res = await getSavedChart();
      const updated = res.data.find((c) => c.chartId === chartId);
      if (updated) setChart(updated);
    } catch (err) {
      console.error("Failed to refresh chart:", err);
    }
  };

 const handleDownloadImage = async () => {
   if (!ready || !canvasRef.current) {
     alert("Chart is not rendered yet.");
     return;
   }

   const dataUrl = canvasRef.current.toDataURL("image/png");
   const link = document.createElement("a");
   link.href = dataUrl;
   link.download = `${chart.title || "chart"}.png`;
   link.click();

   try {
     await incrementDownload({ chartId: chart.chartId , type:"image" });
     toast.success("Image downloaded");
   } catch (error) {
     console.error("Failed to increment image download count:", error);
     toast.error("Failed to update image download count.");
   }
 };

 const handleDownloadPDF = async () => {
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

   try {
     await incrementDownload({ chartId: chart.chartId, type: "pdf" });
     toast.success("PDF downloaded");
   } catch (err) {
     console.error("Failed to increment PDF download count:", err);
     toast.error("Failed to update PDF download count.");
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
        <ChartDetailMain
          chart={chart}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleDownloadImage={handleDownloadImage}
          handleDownloadPDF={handleDownloadPDF}
          ready={ready}
          canvasRef={canvasRef}
        />

        <aside className="space-y-4">
          <ChartDetailInfo
            chart={chart}
            onSummarySaved={refreshChartFromServer}
          />
        </aside>
      </div>
    </div>
  );
};

export default ChartDetail;
