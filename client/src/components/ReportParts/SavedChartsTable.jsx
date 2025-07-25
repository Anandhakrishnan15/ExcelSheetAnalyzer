import React from "react";

const SavedChartsTable = ({
  filteredCharts,
  selectedCharts,
  setSelectedCharts,
  loading,
  error,
}) => {
  const toggleAll = () => {
    if (selectedCharts.length === filteredCharts.length) {
      setSelectedCharts([]);
    } else {
      setSelectedCharts(filteredCharts.map((c) => c.chartId));
    }
  };

  if (loading) return <p>Loading saved charts...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <button
        className="mb-2 text-sm text-blue-600 underline"
        onClick={toggleAll}
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
              <tr key={chart.chartId} className="hover:bg-[var(--border)]">
                <td className="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedCharts.includes(chart.chartId)}
                    onChange={(e) => {
                      const newSelection = e.target.checked
                        ? [...selectedCharts, chart.chartId]
                        : selectedCharts.filter((id) => id !== chart.chartId);
                      setSelectedCharts(newSelection);
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
  );
};

export default SavedChartsTable;
