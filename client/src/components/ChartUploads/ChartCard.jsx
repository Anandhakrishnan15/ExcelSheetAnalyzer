import ChartControls from "./ChartControls";
import ChartRenderer from "./ChartRenderer";
import { X } from "lucide-react";


const ChartCard = ({
  chart,
  index,
  columns,
  updateChart,
  rows,
  handleRemove,
  handleSave,
  isMobile,
}) => {
  return (
    <div className="flex flex-col bg-[var(--card)] p-4 w-full rounded-lg shadow hover:shadow-lg transition h-fit relative">
      {/* X Icon positioned absolutely in top-right */}
      <button
        onClick={() => handleRemove(index)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-0 active:ring-0 border-none"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Input */}
      <input
        type="text"
        className="text-lg w-[50%] m-auto font-semibold mb-3 text-center bg-transparent border-b border-[var(--border)] focus:outline-none focus:border-blue-500"
        value={chart.title}
        onChange={(e) => updateChart(index, "title", e.target.value)}
      />

      {/* Chart Controls */}
      <ChartControls
        chart={chart}
        index={index}
        columns={columns}
        updateChart={updateChart}
        isMobile={isMobile}
      />

      {/* Chart Renderer */}
      <ChartRenderer
        type={chart.graphType}
        xAxis={chart.xAxis}
        yAxis={chart.yAxis}
        data={rows}
      />

      {/* Save Button */}
      <button
        onClick={() => handleSave(index)} // make sure to define handleSave
        className="mt-1 self-end bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
      >
        Save
      </button>
    </div>
  );
}; 

export default ChartCard;
