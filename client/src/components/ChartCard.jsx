import ChartControls from "./ChartControls";
import ChartRenderer from "./ChartRenderer";

const ChartCard = ({ chart, index, columns, updateChart, rows }) => (
  <div className="flex flex-col bg-[var(--card)] p-4 rounded-lg shadow hover:shadow-lg transition h-fit">
    <input
      type="text"
      className="text-lg font-semibold mb-3 w-full text-center bg-transparent border-b border-[var(--border)] focus:outline-none focus:border-blue-500"
      value={chart.title}
      onChange={(e) => updateChart(index, "title", e.target.value)}
    />
    <ChartControls
      chart={chart}
      index={index}
      columns={columns}
      updateChart={updateChart}
    />
    <ChartRenderer
      type={chart.graphType}
      xAxis={chart.xAxis}
      yAxis={chart.yAxis}
      data={rows}
    />
  </div>
);

export default ChartCard;
