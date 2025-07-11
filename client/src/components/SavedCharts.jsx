import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { getSavedChart } from "../services/AuthAPI";
import ChartCard from "./ChartUploads/ChartCard";

const SavedCharts = forwardRef(({ uploadedFileId, onChartClick }, ref) => {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCharts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getSavedChart();
      setCharts(response.data);
    } catch (err) {
      console.error("Error fetching charts:", err);
      setError("Failed to load charts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  // Make fetchCharts callable externally
  useImperativeHandle(ref, () => ({
    refreshCharts: fetchCharts,
  }));

  // Sort charts by createdAt descending (newest first)
  const sortedCharts = charts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredCharts = uploadedFileId
    ? sortedCharts.filter((chart) => chart.uploadedFile === uploadedFileId)
    : sortedCharts;

  if (loading) return <p>Loading charts...</p>;
  if (error) return <p>{error}</p>;

  if (filteredCharts.length === 0) {
    return <p className="text-gray-500">No charts found.</p>;
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {filteredCharts.map((chart, index) => (
        <div
          key={chart._id || chart.chartId}
          onClick={() => onChartClick(chart)}
          className="cursor-pointer border border-[var(--border)] flex-1 min-w-[200px] max-w-full sm:min-w-[300px] sm:max-w-[450px] p-4 rounded shadow hover:shadow-lg transition"
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
