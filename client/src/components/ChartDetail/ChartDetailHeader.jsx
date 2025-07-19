import React from "react";

export default function ChartDetailHeader({
  title,
  activeTab,
  setActiveTab,
  handleDownloadImage,
  handleDownloadPDF,
  ready,
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2 bg-[var(--card)] rounded-t">
      <div className="flex space-x-2">
        {["Chart", "Data Table"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-500"
                : "hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-center flex-1">{title}</h2>
      <div className="flex gap-2">
        <button
          onClick={handleDownloadImage}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-purple-600 text-white rounded hover:bg-purple-500"
          disabled={!ready}
        >
          ⬇ Image
        </button>
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-500"
          disabled={!ready}
        >
          ⬇ PDF
        </button>
      </div>
    </div>
  );
}
