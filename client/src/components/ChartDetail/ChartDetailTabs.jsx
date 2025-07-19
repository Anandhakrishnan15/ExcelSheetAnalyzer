import React from "react";
import ChartCard from "../ChartUploads/ChartCard";

export default function ChartDetailTabs({
  activeTab,
  chart,
  canvasRef,
  ready,
}) {
  return (
    <div className="p-4">
      {activeTab === "Chart" && (
        <div className="space-y-4">
          <div className="border border-[var(--border)] rounded p-4">
            <ChartCard
              chart={chart}
              index={0}
              rows={chart.data}
              readOnly
              canvasRef={canvasRef}
            />
          </div>
          {!ready && (
            <p className="text-gray-500">Preparing chart... Please wait.</p>
          )}
        </div>
      )}

      {activeTab === "Data Table" && (
        <div className="overflow-x-auto border border-[var(--border)] rounded">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {Object.keys(chart.data?.[0] || {}).map((col) => (
                  <th
                    key={col}
                    className="border px-3 py-1 text-left font-medium bg-[var(--border)]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.data?.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--border)]">
                  {Object.keys(row).map((col) => (
                    <td key={col} className="border px-3 py-1">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
