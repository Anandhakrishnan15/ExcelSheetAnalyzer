import React from 'react'

export const QuickActions = () => {
  return (
    <div className="bg-[var(--card)] p-4 rounded shadow border border-[var(--border)]">
      <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
      <div className="flex flex-col gap-2">
        <button
          className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          onClick={() => navigate("/upload")}
        >
          Upload New File
        </button>
        <button
          className="w-full px-3 py-2 bg-amber-500 text-white text-sm rounded hover:bg-amber-600"
          onClick={() => navigate("/charts")}
        >
          View My Charts
        </button>
        <button
          className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          onClick={() => navigate("/reports")}
        >
          Generate Report
        </button>
        <button
          className="w-full px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          onClick={() => navigate("/settings")}
        >
          Settings
        </button>
      </div>
    </div>
  );
}

export const Tips = () => {
  return (
    <div className="bg-[var(--card)] p-4 rounded shadow border border-[var(--border)]">
      <h2 className="text-lg font-semibold mb-3">Helpful Tips</h2>
      <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
        <li>Use Quick Actions to jump between sections.</li>
        <li>Upload Excel files to create new charts.</li>
        <li>Access your reports anytime from the Reports page.</li>
      </ul>
    </div>
  );
};
  