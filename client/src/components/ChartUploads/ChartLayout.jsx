import { Outlet, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const ChartLayout = () => {
  const { filename } = useParams();
  const location = useLocation();

  // This example assumes fileData comes from route state
  const fileData = location.state?.fileData;

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(false);
  const [previewChart, setPreviewChart] = useState(null);

  useEffect(() => {
    function screenResize() {
      const width = window.innerWidth;
      setIsSidebarOpen(width > 1024);
      setIsMobile(width <= 475);
    }
    window.addEventListener("resize", screenResize);
    screenResize();
    return () => window.removeEventListener("resize", screenResize);
  }, []);
  console.log(fileData);
  

  return (
    <div className="flex min-h-[80vh] bg-[var(--body)]">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        filename={filename}
        fileData={fileData}
        isMobile={isMobile}
        onChartClick={(chart) => setPreviewChart(chart)}
      />
      <main className="flex-1 p-8 space-y-8 overflow-hidden">
        {/* Children components render here */}
        <Outlet
          context={{ fileData, isMobile, previewChart, setPreviewChart }}
        />
      </main>
    </div>
  );
};

export default ChartLayout;
