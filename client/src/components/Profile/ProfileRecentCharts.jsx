export default function ProfileRecentCharts({
  recentCharts,
  loadingCharts,
  navigate,
}) {
  return (
    <div className="w-full max-w-xl bg-[var(--card)] rounded-lg shadow p-6 border border-[var(--border)] mb-6">
      <h2 className="text-2xl font-semibold mb-4">Recent Charts</h2>
      {loadingCharts ? (
        <p className="text-sm text-gray-500">Loading charts...</p>
      ) : recentCharts.length === 0 ? (
        <p className="text-sm text-gray-500">No charts saved yet.</p>
      ) : (
        <ul className="space-y-3">
          {recentCharts.map((chart) => (
            <li
              key={chart.chartId}
              className="flex justify-between items-center p-3 bg-[var(--body)] rounded border border-[var(--border)]"
            >
              <div className="flex flex-col space-y-1">
                <p
                  className="text-sm font-semibold truncate max-w-[180px]"
                  title={chart.title || "Untitled Chart"}
                >
                  {chart.title || "Untitled Chart"}
                </p>
                <div className="flex space-x-4">
                  <p className="text-xs text-gray-600">
                    {chart.type || "Unknown Type"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {chart.createdAt
                      ? new Date(chart.createdAt).toLocaleDateString()
                      : "Date unknown"}
                  </p>
                </div>
              </div>
              <button
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 shrink-0"
                onClick={() => navigate(`/chart/${chart.chartId}`)}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
