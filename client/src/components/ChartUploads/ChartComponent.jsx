import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChartCard from "./ChartCard";

const ChartComponent = () => {
  const { filename } = useParams();
  const location = useLocation();
  const [charts, setCharts] = useState([
    { id: 1, title: "Chart 1", xAxis: "", yAxis: "", graphType: "bar" },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(false);

  const fileData = location.state?.fileData;
  const columns = fileData?.rows?.length ? Object.keys(fileData.rows[0]) : [];

  const updateChart = (index, key, value) => {
    const updated = [...charts];
    updated[index][key] = value;
    setCharts(updated);
  };
  const handleRemove = (indexToRemove) => {
    setCharts((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
  

  useEffect(() => {
    function screenResize() {
      const width = window.innerWidth;

      // Sidebar open/close
      if (width <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }

      // Mobile detection
      if (width <= 475) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    window.addEventListener("resize", screenResize);
    // Run once on mount
    screenResize();

    return () => window.removeEventListener("resize", screenResize);
  }, []);
  

  return (
    <div className="flex min-h-[80vh] bg-[var(--body)]">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        filename={filename}
        fileData={fileData}
        isMobile={isMobile}
      />
      <main className="flex-1 p-8 space-y-8 overflow-hidden">
        <h2 className="text-2xl font-bold text-center mb-6">
          Chart for file: {filename}
        </h2>

        <button
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded transition"
          onClick={() =>
            setCharts((prev) => [
              {
                id: Date.now(),
                title: "New Chart",
                xAxis: "",
                yAxis: "",
                graphType: "bar",
              },
              ...prev,
            ])
          }
        >
          <span className="text-lg leading-none">＋</span>
          Add Chart
        </button>

        <div className="flex flex-wrap justify-center gap-5  ">
          {charts.map((chart, index) => (
            <div
              key={chart.id}
              className="
        flex-1
        min-w-[250px] max-w-full
        sm:min-w-[400px] sm:max-w-[500px]
        md:min-w-[500px] md:max-w-[600px]
      "
            >
              <ChartCard
                chart={chart}
                index={index}
                columns={columns}
                updateChart={updateChart}
                rows={fileData?.rows || []}
                handleRemove={handleRemove}
                isMobile={isMobile}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChartComponent;
