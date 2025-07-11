import MultiSelectDropdown from "../MultiSelectDropdown";

const ChartControls = ({ chart, index, columns, updateChart, isMobile }) => {
  const selectClass = `
    border border-[var(--border)] 
    bg-[var(--card)] 
    rounded 
    px-3 py-1 
    text-sm 
    focus:outline-none 
    focus:ring-2 focus:ring-blue-500
    ${isMobile ? "w-15" : "w-auto"}
  `;

  const yAxisSelected = Array.isArray(chart.yAxis)
    ? chart.yAxis
    : [chart.yAxis].filter(Boolean);

  return (
    <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4 w-full mb-4">
      {/* Axis selectors */}
      <div className="flex gap-6 flex-wrap">
        {/* X Axis */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1">X-Axis</label>
          <select
            className={selectClass}
            value={chart.xAxis || ""}
            onChange={(e) => updateChart(index, "xAxis", e.target.value)}
          >
            <option className="bg-[var(--border)]" value="">
              Select column
            </option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Y Axis */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1">Y-Axis (multiple)</label>
          <MultiSelectDropdown
            options={columns}
            selected={yAxisSelected}
            onChange={(newSelection) =>
              updateChart(index, "yAxis", newSelection)
            }
            placeholder="Select columns"
          />
        </div>
      </div>

      {/* Chart Type */}
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1">Chart Type</label>
        <select
          className={selectClass}
          value={chart.type || "bar"}
          onChange={(e) => updateChart(index, "type", e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="area">Area</option>
          <option value="scatter">Scatter</option>
          <option value="pie">Pie</option>
          <option value="doughnut">Doughnut</option>
        </select>
      </div>
    </div>
  );
};

export default ChartControls;
