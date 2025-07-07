import React from "react";
import { X } from "lucide-react";
import ChartCard from "./ChartCard";
// import ChartCard from "./ChartCard";

const ChartPreview = ({ chart, onClose, rows }) => {
  if (!chart) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[var(--card)] rounded-lg p-6 w-full max-w-4xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{chart.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart Display */}
          <div className="p-4 border border-[var(--border)] rounded shadow">
            <ChartCard
              chart={chart}
              index={0}
              type={chart.type}
              xAxis={chart.config?.xAxis}
              yAxis={chart.config?.yAxis}
              rows={rows || []}
              readOnly
            />
          </div>

          {/* Chart Details */}
          <div className="space-y-2 text-sm overflow-y-auto max-h-[70vh] pr-2">
            {Object.entries(chart).map(([key, value]) => (
              <div key={key}>
                <span className="font-semibold">{key}:</span>{" "}
                {typeof value === "object" ? (
                  <details className="bg-[var(--border)] rounded p-2">
                    <summary className="cursor-pointer">View details</summary>
                    <pre className="whitespace-pre-wrap break-all">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  </details>
                ) : (
                  <span>{String(value)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPreview;
