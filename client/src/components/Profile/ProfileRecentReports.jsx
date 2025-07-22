import { useEffect, useState } from "react";
import { getAIReports } from "../../services/AuthAPI";

export default function ProfileRecentReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchReports = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getAIReports();
      const reportsArray = res?.data?.reports ?? [];

      // console.log("Fetched reports:", reportsArray);

      // if (!Array.isArray(reportsArray)) {
      //   throw new Error("Invalid reports data");
      // }

      const sorted = reportsArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReports(sorted.slice(0, 3));
    } catch (err) {
      // console.error("❌ Failed to load reports:", err);
      setError("NO recent AI Reports Created yet");
    } finally {
      setLoading(false);
    }
  };

  fetchReports();
}, []);



  if (loading) {
    return (
      <div className="w-full max-w-xl bg-[var(--card)] rounded-lg shadow p-6 border border-[var(--border)] mb-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Reports</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-xl bg-[var(--card)] rounded-lg shadow p-6 border border-[var(--border)] mb-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Reports</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

   return (
  <div className="w-full max-w-xl bg-[var(--card)] rounded-lg shadow p-6 border border-[var(--border)] mb-6">
    <h2 className="text-2xl font-semibold mb-4">Recent Reports</h2>

    {reports.length === 0 ? (
      <div className="w-full py-10 text-center text-gray-400 italic">
        You haven't generated any AI reports yet.
      </div>
    ) : (
      <ul className="space-y-3">
        {reports.map((report) => (
          <li
            key={report._id}
            className="flex justify-between items-start p-3 bg-[var(--body)] rounded border border-[var(--border)]"
          >
            <div>
              <p className="text-sm font-semibold">{report.title}</p>
              <p className="text-xs text-gray-500">
                Generated: {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleDownload(report)}
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>


  );
}

// Helper to download the report as .txt
function handleDownload(report) {
  const element = document.createElement("a");
  const file = new Blob([report.generatedReport], {
    type: "text/plain",
  });
  element.href = URL.createObjectURL(file);
  element.download = `${report.title || "report"}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
