// ChartDetail.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ChartDetailMain from "../components/ChartDetail/ChartDetailMain";
import ChartDetailInfo from "../components/ChartDetail/ChartDetailInfo";
import { getSavedChart, incrementDownload } from "../services/AuthAPI";
import {
  waitForCanvases,
  renderChartToImageBlob,
  blobToDataURL,
  downloadSingleChartPDF,
} from "../utils/reportUtils";


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
    if (!ready || !chart) {
      alert("Chart is not rendered yet.");
      return;
    }
    const blob = await renderChartToImageBlob(chart, 0);
    const url = await blobToDataURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${chart.title?.replace(/\s+/g, "_") || "chart"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


// import { , renderChartToImageBlob } from "./yourUtilityFile"; // Adjust import path

const handleDownloadPDF = async () => {
  if (!chart) {
    alert("Chart is not available.");
    return;
  }
  await downloadSingleChartPDF(chart);
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
