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
  disabled,
  readOnly = false,
  canvasRef,
}) => {
  return (
    <div className="flex flex-col bg-[var(--card)] p-4 w-full rounded-lg shadow hover:shadow-lg transition h-fit relative">
      {!readOnly && (
        <button
          onClick={() => handleRemove(index)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none border-none"
          aria-label="Remove chart"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {readOnly ? (
        <h3 className="text-lg font-semibold text-center mb-3">
          {chart.title}
        </h3>
      ) : (
        <input
          type="text"
          className="text-lg w-[50%] m-auto font-semibold mb-3 text-center bg-transparent border-b border-[var(--border)] focus:outline-none focus:border-blue-500"
          value={chart.title}
          onChange={(e) => updateChart(index, "title", e.target.value)}
        />
      )}

      {!readOnly && (
        <ChartControls
          chart={chart}
          index={index}
          columns={columns}
          updateChart={updateChart}
          isMobile={isMobile}
        />
      )}

      <ChartRenderer
        ref={canvasRef}
        type={chart.type || 'bar'}
        xAxis={chart.xAxis || chart.config?.xAxis}
        yAxis={chart.yAxis || chart.config?.yAxis}
        data={rows}
      />

      {!readOnly && (
        <button
          onClick={() => handleSave(chart)}
          className={`mt-1 self-end px-2 py-1 rounded transition
            ${
              disabled
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          disabled={readOnly}
        >
          {disabled ? "Saved" : "Save Chart"}
        </button>
      )}
    </div>
  );
};

export default ChartCard;
