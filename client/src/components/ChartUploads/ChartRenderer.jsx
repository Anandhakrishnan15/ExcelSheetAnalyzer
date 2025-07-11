import { forwardRef, useImperativeHandle, useRef } from "react";
import { Bar, Line, Pie, Doughnut, Scatter } from "react-chartjs-2";
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

const generateColors = (count, alpha = 1) => {
  const palette = [
    `rgba(79,70,229,${alpha})`, // #4F46E5
    `rgba(34,197,94,${alpha})`, // #22C55E
    `rgba(245,158,11,${alpha})`, // #F59E0B
    `rgba(239,68,68,${alpha})`, // #EF4444
    `rgba(59,130,246,${alpha})`, // #3B82F6
    `rgba(236,72,153,${alpha})`, // #EC4899
    `rgba(16,185,129,${alpha})`, // #10B981
    `rgba(139,92,246,${alpha})`, // #8B5CF6
    `rgba(234,179,8,${alpha})`, // #EAB308
    `rgba(249,115,22,${alpha})`, // #F97316
  ];
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

const ChartRenderer = forwardRef(({ type, xAxis, yAxis, data }, canvasRef) => {
  const chartInstanceRef = useRef(null);

  useImperativeHandle(canvasRef, () => {
    if (chartInstanceRef.current) {
      return chartInstanceRef.current.canvas;
    }
    return null;
  });

  const shouldRenderDemo = !type || !xAxis || !yAxis || !data?.length;

  const demoLabels = ["0", "1", "2", "3"];
  const demoValues = [0, 0, 0, 0];

  const ChartComponent = {
    bar: Bar,
    line: Line,
    area: Line,
    scatter: Scatter,
    pie: Pie,
    doughnut: Doughnut,
  }[type || "bar"];

  const labels = shouldRenderDemo ? demoLabels : data.map((row) => row[xAxis]);

  let datasets;

  if (shouldRenderDemo) {
    datasets = [
      {
        label: "Demo Data",
        data:
          type === "scatter"
            ? demoLabels.map((label, i) => ({ x: i, y: demoValues[i] }))
            : demoValues,
        backgroundColor: generateColors(
          demoValues.length,
          type === "area" ? 0.6 : 1
        ),
        borderColor: generateColors(demoValues.length, 1),
        borderWidth: 1,
        fill: type === "area",
        tension: type === "area" ? 0.4 : 0,
        pointRadius: type === "scatter" ? 5 : 3,
        showLine: type === "scatter" ? true : undefined,
      },
    ];
  } else {
    const yKeys = Array.isArray(yAxis) ? yAxis : [yAxis];
    datasets = yKeys.map((yKey, i) => ({
      label: yKey,
      data:
        type === "scatter"
          ? data.map((row) => ({
              x: Number(row[xAxis]),
              y: Number(row[yKey]),
            }))
          : data.map((row) => Number(row[yKey])),
      backgroundColor:
        type === "pie" || type === "doughnut"
          ? generateColors(data.length)
          : generateColors(yKeys.length, type === "area" ? 0.6 : 1)[i], // alpha 0.6 for area
      borderColor:
        type === "pie" || type === "doughnut"
          ? generateColors(data.length)
          : generateColors(yKeys.length, 1)[i],
      borderWidth: 2,
      fill: type === "area",
      tension: type === "area" ? 0.4 : 0,
      pointRadius: type === "scatter" ? 5 : 3,
      showLine: type === "scatter" ? true : undefined,
    }));
  }

  const chartData = {
    labels: type === "scatter" ? undefined : labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        enabled: true,
        callbacks:
          type === "scatter"
            ? {
                label: (ctx) => `(${ctx.parsed.x}, ${ctx.parsed.y})`,
              }
            : {},
      },
    },
    scales:
      type === "pie" || type === "doughnut"
        ? undefined
        : {
            x:
              type === "scatter"
                ? {
                    type: "linear",
                    position: "bottom",
                    title: {
                      display: true,
                      text: xAxis,
                      font: { size: 14, weight: "bold" },
                    },
                    grid: { display: true },
                  }
                : {
                    beginAtZero: true,
                    grid: { display: true },
                    title: {
                      display: true,
                      text: xAxis,
                      font: { size: 14, weight: "bold" },
                    },
                  },
            y: {
              beginAtZero: true,
              grid: { display: true },
              title: {
                display: true,
                text: Array.isArray(yAxis) ? yAxis.join(", ") : yAxis,
                font: { size: 14, weight: "bold" },
              },
            },
          },
  };

  return (
    <div className="w-full relative h-[300px]">
      {shouldRenderDemo && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 pointer-events-none">
          Showing demo chart. Select X/Y axis and graph type.
        </p>
      )}
      <ChartComponent
        ref={chartInstanceRef}
        data={chartData}
        options={options}
      />
    </div>
  );
});

export default ChartRenderer;
