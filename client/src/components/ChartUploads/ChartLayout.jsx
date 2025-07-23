import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const ChartLayout = () => {
  const { filename } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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

  // 🛑 Redirect if no fileData available
  useEffect(() => {
    if (!fileData) {
      toast.error("⚠️ Chart data not found. Please upload a file first.");
      navigate("/upload", { replace: true });
    }
  }, [fileData, navigate]);

  return (
    <div className="flex min-h-[80vh] bg-[var(--body)]">
      {fileData && (
        <>
          <Sidebar
            isOpen={isSidebarOpen}
            toggle={() => setIsSidebarOpen(!isSidebarOpen)}
            filename={filename}
            fileData={fileData}
            isMobile={isMobile}
            onChartClick={(chart) => setPreviewChart(chart)}
          />
          <main className="flex-1 p-8 space-y-8 overflow-hidden">
            <Outlet
              context={{ fileData, isMobile, previewChart, setPreviewChart }}
            />
          </main>
        </>
      )}
    </div>
  );
};

export default ChartLayout;
