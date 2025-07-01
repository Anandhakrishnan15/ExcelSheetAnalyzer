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
  const shouldRenderDemo = !type || !xAxis || !yAxis || !data?.length;

  // Demo data
  const demoLabels = ["0", "1", "2", "6"];
  const demoValues = [0,0,0,0,];
  // const demoColors = generateColors(demoValues.length);

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
  }[type || "bar"]; // fallback to bar chart

  // Decide chart data
  const labels = shouldRenderDemo ? demoLabels : data.map((row) => row[xAxis]);
  const values = shouldRenderDemo
    ? demoValues
    : data.map((row) => Number(row[yAxis]));
  const colors = generateColors(values.length);

  const chartData = {
    labels,
    datasets: [
      {
        label: shouldRenderDemo ? "Demo Data" : `${yAxis}`,
        data: values,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales:
      (type || "bar") !== "pie"
        ? {
            x: {
              beginAtZero: true,
              grid: { display: true },
              border: { display: false },
            },
            y: {
              beginAtZero: true,
              grid: { display: true },
              border: { display: false },
            },
          }
        : undefined,
  };

  return (
    <div className="w-full relative h-[300px]">
      {shouldRenderDemo && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 pointer-events-none">
          Showing demo chart. Select X/Y axis and graph type.
        </p>
      )}
      <ChartComponent data={chartData} options={options} />
    </div>
  );
  
};

export default ChartRenderer;
