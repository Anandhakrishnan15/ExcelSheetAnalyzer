import React from "react";
import ChartCard from "../ChartUploads/ChartCard";
import ChartSummary from "../ChartSummary";

const ChartPreviewList = ({
  selectedCharts,
  filteredCharts,
  chartRefs,
  fileData,
  setSelectedCharts,
  refreshChartFromServer,
}) => {
  if (selectedCharts.length === 0) {
    return <p className="text-gray-500">No charts selected.</p>;
  }

  return (
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
                setSelectedCharts((prev) => prev.filter((id) => id !== chartId))
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
            <ChartSummary
              chart={chart}
              onSummarySaved={() => refreshChartFromServer(chart.chartId)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ChartPreviewList;
