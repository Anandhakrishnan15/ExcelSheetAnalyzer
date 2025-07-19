export default function ProfileCountsGrid({ dashboardCounts, loadingCounts }) {
  const metrics = [
    { key: "uploadCount", label: "Files Uploaded" },
    { key: "chartCount", label: "Charts Created" },
    { key: "reportCount", label: "Reports Generated" },
    // { key: "totalImageDownloads", label: "Images Downloaded" },
    // { key: "totalPDFDownloads", label: "PDFs Downloaded" },
  ];

  return (
    <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
      {metrics.map(({ key, label }) => (
        <div
          key={key}
          className="bg-[var(--card)] p-4 rounded border border-[var(--border)] text-center"
        >
          {loadingCounts ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <>
              <p className="text-lg font-semibold">
                {dashboardCounts?.[key] ?? 0}
              </p>
              <p className="text-xs text-gray-500">{label}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
