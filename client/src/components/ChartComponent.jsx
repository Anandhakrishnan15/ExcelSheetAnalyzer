import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import ChartCard from "./ChartCard";

const ChartComponent = () => {
  const { filename } = useParams();
  const location = useLocation();
  const [charts, setCharts] = useState([
    { id: 1, title: "Chart 1", xAxis: "", yAxis: "", graphType: "bar" },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fileData = location.state?.fileData;
  const columns = fileData?.rows?.length ? Object.keys(fileData.rows[0]) : [];
  console.log(columns);
  

  const updateChart = (index, key, value) => {
    const updated = [...charts];
    updated[index][key] = value;
    setCharts(updated);
  };

  return (
    <div className="flex min-h-[90vh] bg-[var(--body)]">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        filename={filename}
        fileData={fileData}
      />
      <main className="flex-1 p-8 space-y-8 ">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charts.map((chart, index) => (
            <ChartCard
              key={chart.id}
              chart={chart}
              index={index}
              columns={columns}
              updateChart={updateChart}
              rows={fileData?.rows || []}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChartComponent;
