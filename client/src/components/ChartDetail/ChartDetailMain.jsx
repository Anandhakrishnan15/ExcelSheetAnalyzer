import React from "react";
import ChartDetailHeader from "./ChartDetailHeader";
import ChartDetailTabs from "./ChartDetailTabs";

export default function ChartDetailMain({
  chart,
  activeTab,
  setActiveTab,
  handleDownloadImage,
  handleDownloadPDF,
  ready,
  canvasRef,
}) {
  return (
    <div className="lg:col-span-2 space-y-4 border border-[var(--border)] rounded shadow bg-[var(--card)]">
      <ChartDetailHeader
        title={chart.title}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleDownloadImage={handleDownloadImage}
        handleDownloadPDF={handleDownloadPDF}
        ready={ready}
      />
      <ChartDetailTabs
        activeTab={activeTab}
        chart={chart}
        canvasRef={canvasRef}
        ready={ready}
      />
    </div>
  );
}
