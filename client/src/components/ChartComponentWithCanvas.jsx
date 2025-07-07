// ChartComponentWithCanvas.js
import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

export default function ChartComponentWithCanvas({ chartConfig }) {
  const canvasRef = useRef();

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const myChart = new Chart(ctx, chartConfig);
    return () => myChart.destroy();
  }, [chartConfig]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={300}
      style={{ background: "white", borderRadius: "8px" }}
    />
  );
}
