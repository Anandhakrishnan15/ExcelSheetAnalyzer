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
  const fileData = location.state?.fileData;
  const columns = fileData?.rows?.length ? Object.keys(fileData.rows[0]) : [];

  const updateChart = (index, key, value) => {
    const updated = [...charts];
    updated[index][key] = value;
    setCharts(updated);
  };

useEffect(()=>{
  function screenResize(){
    if(window.innerWidth <= 1024){
      setIsSidebarOpen(false)
    }else{
      setIsSidebarOpen(true)
    }
  }
  window.addEventListener('resize',screenResize)
  screenResize()
  return () => window.removeEventListener("resize", screenResize);
},[])

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

        <div className="flex flex-wrap justify-center gap-6">
          {charts.map((chart, index) => (
            <div key={chart.id} className="flex-1 min-w-[400px] max-w-[600px]">
              <ChartCard
                chart={chart}
                index={index}
                columns={columns}
                updateChart={updateChart}
                rows={fileData?.rows || []}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChartComponent;
