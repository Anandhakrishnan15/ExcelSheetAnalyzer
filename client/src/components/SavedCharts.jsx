import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { getSavedChart } from "../services/AuthAPI";
import ChartCard from "./ChartUploads/ChartCard";
import { useNavigate } from "react-router-dom";

const SavedCharts = forwardRef(({ uploadedFileId, onChartClick }, ref) => {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCharts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getSavedChart();
      if (!response || !response.data) {
        console.warn("No response or response data:", response);
        setCharts([]);
        return;
      }

      setCharts(response.data); // Make sure it's an array
    } catch (err) {
      if (err.response?.status === 404) {
        // No charts found — not an actual error
        setCharts([]);
      } else {
        console.error(
          "Error fetching charts:",
          err.response || err.message || err
        );
        setError("Failed to load charts.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshCharts: fetchCharts,
  }));

  const sortedCharts = charts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredCharts = uploadedFileId
    ? sortedCharts.filter((chart) => chart.uploadedFile === uploadedFileId)
    : sortedCharts;

  if (loading) return <p>Loading charts...</p>;

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        <p className="text-lg mb-2">{error}</p>
      </div>
    );
  }

  if (filteredCharts.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        <p className="text-lg mb-2">No charts found.</p>
        <button
          onClick={() => navigate("/upload")} // Adjust if needed
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create One Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {filteredCharts.map((chart, index) => (
        <div
          key={chart._id || chart.chartId}
          onClick={() => onChartClick(chart)}
          className="cursor-pointer border border-[var(--border)] flex-1 min-w-[300px] max-w-full sm:min-w-[300px] sm:max-w-[450px] p-4 rounded shadow hover:shadow-lg transition"
        >
          <ChartCard
            chart={chart}
            index={index}
            rows={chart.data || []}
            readOnly
          />
        </div>
      ))}
    </div>
  );
});

export default SavedCharts;
