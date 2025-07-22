import React, { useEffect, useState } from "react";
import { globalCount } from "../../services/AuthAPI"; // adjust the path based on your project structure

const DashboardStats = () => {
  const [totals, setTotals] = useState({
    totalUsers: 0,
    totalReports: 0,
    totalCharts: 0,
    totalUploads: 0,
    totalImageDownloads: 0,
    totalPDFDownloads: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalTotals = async () => {
      try {
        const res = await globalCount();
        setTotals(res.data?.data || {});
      } catch (err) {
        console.error("Failed to fetch global totals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalTotals();
  }, []);

  return (
    <div className="w-full max-w-xl grid grid-cols-2 gap-4 mb-6">
      <StatCard
        title="Total Users"
        value={loading ? "..." : totals.totalUsers}
        color="text-red-500"
      />
      <StatCard
        title="Total Reports"
        value={loading ? "..." : totals.totalReports}
        color="text-blue-500"
      />
      <StatCard
        title="Total Charts"
        value={loading ? "..." : totals.totalCharts}
        color="text-green-500"
      />
      <StatCard
        title="Total Uploads"
        value={loading ? "..." : totals.totalUploads}
        color="text-purple-500"
      />
      <StatCard
        title="Image Downloads"
        value={loading ? "..." : totals.totalImageDownloads}
        color="text-yellow-500"
      />
      <StatCard
        title="PDF Downloads"
        value={loading ? "..." : totals.totalPDFDownloads}
        color="text-pink-500"
      />
    </div>
  );
};

const StatCard = ({ title, value, color, fullWidth }) => (
  <div
    className={`flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow ${
      fullWidth ? "col-span-2" : ""
    }`}
  >
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-gray-500">{title}</div>
  </div>
);

export default DashboardStats;
