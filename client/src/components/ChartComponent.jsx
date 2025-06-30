import { useParams, useLocation } from "react-router-dom";
import AllUploedExels from "./AllUploedExels";
import { useState } from "react";

const ChartComponent = () => {
  const { filename } = useParams();
  const location = useLocation();
  const [charts, setCharts] = useState([
    { id: 1, title: "Chart 1", xAxis: "", yAxis: "" },
  ]);

  const fileData = location.state?.fileData;

  return (
    <div className="flex min-h-[90vh] bg-[var(--body)]">
      {/* side bar with table and and all the uploded sheets */}
      <aside className="w-auto bg-[var(--body)] border-r p-4 sticky">
        <h3 className="text-lg font-semibold mb-4">Chart Types</h3>
        
        {/* Data Table */}
        <div className="max-w-3xl mx-auto h-[400px] bg-[var(--card)] p-4  pt-0 rounded shadow overflow-auto scrollbar-black mb-5">
          <h4 className="text-lg font-medium p-2 border-b sticky top-0 bg-[var(--card)] z-11">
            Data Table of {filename}
          </h4>
          {fileData?.rows?.length > 0 ? (
            <table className="w-full border border-[var(--border)] text-sm">
              <thead className="sticky top-10 bg-[var(--card)] z-10">
                <tr>
                  {Object.keys(fileData.rows[0]).map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 border-b border-[var(--border)] text-left font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileData.rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--border)]"
                    }
                  >
                    {Object.values(row).map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-4 py-2 border-b border-gray-200"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div>

        {/* Axes selection */}
        {/* <div className=" mt-2.5 max-w-xl mx-auto mb-8 bg-[var(--card)] p-4 rounded shadow">
          <h4 className="text-lg font-medium mb-4">Select Axes</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 text-sm">X-Axis</label>
              <select className="w-full border rounded px-3 py-2 bg-[var(--card)] ">
                <option className="bg-[var(--border)]" value="">
                  Select column
                </option>
                {fileData?.rows?.length > 0 &&
                  Object.keys(fileData.rows[0]).map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm">Y-Axis</label>
              <select className="w-full border rounded px-3 py-2 bg-[var(--card)]">
                <option className="bg-[var(--border)]" value="">
                  Select column
                </option>
                {fileData?.rows?.length > 0 &&
                  Object.keys(fileData.rows[0]).map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div> */}

        <AllUploedExels />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Chart for file: {filename}
        </h2>

        {/* Top Bar: Axis selectors and Add button */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--card)] p-4 rounded shadow">
          <div className="flex gap-4 flex-wrap w-full md:w-auto">
            {/* X Axis Selector */}
            <div className="flex flex-col">
              <label className="text-xs font-medium mb-1">X-Axis</label>
              <select
                className="border border-[var(--border)] bg-[var(--card)] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={charts[0].xAxis}
                onChange={(e) => {
                  const updated = [...charts];
                  updated[0].xAxis = e.target.value;
                  setCharts(updated);
                }}
              >
                <option className="bg-[var(--border)]" value="">
                  Select column
                </option>
                {fileData?.rows?.length > 0 &&
                  Object.keys(fileData.rows[0]).map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
              </select>
            </div>

            {/* Y Axis Selector */}
            <div className="flex flex-col">
              <label className="text-xs font-medium mb-1">Y-Axis</label>
              <select
                className="border border-[var(--border)] bg-[var(--card)] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={charts[0].yAxis}
                onChange={(e) => {
                  const updated = [...charts];
                  updated[0].yAxis = e.target.value;
                  setCharts(updated);
                }}
              >
                <option className="bg-[var(--border)]" value="">
                  Select column
                </option>
                {fileData?.rows?.length > 0 &&
                  Object.keys(fileData.rows[0]).map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
        {/* Add Chart Button */}
        <button
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded transition"
          onClick={() =>
            setCharts((prev) => [
              { id: Date.now(), title: "New Chart", xAxis: "", yAxis: "" },
              ...prev,
            ])
          }
        >
          <span className="text-lg leading-none">＋</span>
          Add Chart
        </button>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charts.map((chart, index) => (
            <div
              key={chart.id}
              className="flex flex-col bg-[var(--card)] p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Editable Title */}
              <input
                type="text"
                className="text-lg font-semibold mb-3 w-full text-center bg-transparent border-b border-[var(--border)] focus:outline-none focus:border-blue-500"
                value={chart.title}
                onChange={(e) => {
                  const updated = [...charts];
                  updated[index].title = e.target.value;
                  setCharts(updated);
                }}
              />
              {/* Top Controls Row */}
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 w-full mb-4">
                {/* Axis Selectors */}
                <div className="flex gap-3 flex-wrap">
                  {/* X Axis */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">X-Axis</label>
                    <select
                      className="border border-[var(--border)] bg-[var(--card)] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={chart.xAxis}
                      onChange={(e) => {
                        const updated = [...charts];
                        updated[index].xAxis = e.target.value;
                        setCharts(updated);
                      }}
                    >
                      <option className="bg-[var(--border)]" value="">
                        Select column
                      </option>
                      {fileData?.rows?.length > 0 &&
                        Object.keys(fileData.rows[0]).map((col) => (
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
                      className="border border-[var(--border)] bg-[var(--card)] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={chart.yAxis}
                      onChange={(e) => {
                        const updated = [...charts];
                        updated[index].yAxis = e.target.value;
                        setCharts(updated);
                      }}
                    >
                      <option className="bg-[var(--border)]" value="">
                        Select column
                      </option>
                      {fileData?.rows?.length > 0 &&
                        Object.keys(fileData.rows[0]).map((col) => (
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
                    className="border border-[var(--border)] bg-[var(--card)] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={chart.graphType || ""}
                    onChange={(e) => {
                      const updated = [...charts];
                      updated[index].graphType = e.target.value;
                      setCharts(updated);
                    }}
                  >
                    <option className="bg-[var(--border)]" value="">
                      Select type
                    </option>
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                    <option value="pie">Pie</option>
                  </select>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="w-full h-[220px] bg-[var(--card)] border border-[var(--border)] rounded flex items-center justify-center text-gray-500">
                {chart.graphType
                  ? `${
                      chart.graphType.charAt(0).toUpperCase() +
                      chart.graphType.slice(1)
                    } Chart`
                  : "Chart"}{" "}
                with {chart.xAxis || "..."} vs {chart.yAxis || "..."}
              </div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        {/* <div className="w-full max-w-3xl mx-auto h-[400px] bg-[var(--card)] p-4 rounded shadow overflow-auto">
          <h4 className="text-lg font-medium sticky top-0 p-2 bg-[var(--card)] z-10 border-b">
            Data Table of {filename}
          </h4>
          {fileData?.rows?.length > 0 ? (
            <table className="min-w-full border border-[var(--border)] text-sm">
              <thead className="bg-[var(--card)]">
                <tr>
                  {Object.keys(fileData.rows[0]).map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 border-b border-[var(--border)] text-left font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileData.rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--border)]"
                    }
                  >
                    {Object.values(row).map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-4 py-2 border-b border-gray-200"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div> */}
      </main>
    </div>
  );
};

export default ChartComponent;
