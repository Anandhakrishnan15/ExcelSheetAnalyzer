import React from "react";
import ChartSummary from "../ChartSummary";

export default function ChartDetailInfo({ chart, onSummarySaved }) {
  return (
    <>
      <div className="p-4 border rounded bg-[var(--card)]">
        <h3 className="text-lg font-semibold mb-2">Chart Information</h3>
        <ul className="text-sm space-y-1">
          <li>
            <strong>Title:</strong> {chart.title || "Untitled Chart"}
          </li>
          <li>
            <strong>Type:</strong> {chart.type || "Unknown"}
          </li>
          <li>
            <strong>X-Axis:</strong> {chart.config?.xAxis || "Not specified"}
          </li>
          <li>
            <strong>Y-Axis:</strong>{" "}
            {Array.isArray(chart.config?.yAxis)
              ? chart.config.yAxis.join(", ")
              : typeof chart.config?.yAxis === "string"
              ? chart.config.yAxis
              : "Not specified"}
          </li>
          <li>
            <strong>Created:</strong>{" "}
            {chart.createdAt
              ? new Date(chart.createdAt).toLocaleString()
              : "N/A"}
          </li>
        </ul>
      </div>

      <ChartSummary chart={chart} onSummarySaved={onSummarySaved} />
    </>
  );
}
