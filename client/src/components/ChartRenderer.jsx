import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

// Helper to generate an array of colors
const generateColors = (count) => {
  const palette = [
    "#4F46E5", // Indigo
    "#22C55E", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#3B82F6", // Blue
    "#EC4899", // Pink
    "#10B981", // Emerald
    "#8B5CF6", // Violet
    "#EAB308", // Yellow
    "#F97316", // Orange
  ];
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

const ChartRenderer = ({ type, xAxis, yAxis, data }) => {
  if (!type || !xAxis || !yAxis || !data?.length) {
    return (
      <div className="w-full h-[220px] flex items-center justify-center text-gray-400">
        Select X/Y axis and graph type
      </div>
    );
  }

  // Extract labels and values
  const labels = data.map((row) => row[xAxis]);
  const values = data.map((row) => Number(row[yAxis]));
  const colors = generateColors(values.length);

  // Common dataset config
  const dataset = {
    label: `${yAxis}`,
    data: values,
    backgroundColor: colors,
    borderColor: colors,
    borderWidth: 1,
  };

  // Chart data
  const chartData = {
    labels,
    datasets: [dataset],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: type !== "bar" }, // Show legend for line/pie
      tooltip: { enabled: true },
    },
    scales:
      type !== "pie"
        ? {
            x: { beginAtZero: true },
            y: { beginAtZero: true },
          }
        : undefined,
  };

  // Choose chart component
  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
  }[type];

  return (
    <div className="w-full">
      <ChartComponent data={chartData} options={options} />
    </div>
  );
};

export default ChartRenderer;
