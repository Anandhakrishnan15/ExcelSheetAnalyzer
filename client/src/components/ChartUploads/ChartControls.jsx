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

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 w-full mb-4">
      {/* Axis selectors */}
      <div className="flex gap-3 flex-wrap">
        {/* X Axis */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1">X-Axis</label>
          <select
            className={selectClass}
            value={chart.xAxis}
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
          <label className="text-xs font-medium mb-1">Y-Axis</label>
          <select
            className={selectClass}
            value={chart.yAxis}
            onChange={(e) => updateChart(index, "yAxis", e.target.value)}
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
      </div>

      {/* Graph Type */}
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1">Graph Type</label>
        <select
          className={selectClass}
          value={chart.graphType || "bar"}
          onChange={(e) => updateChart(index, "graphType", e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>
    </div>
  );
};

export default ChartControls;
