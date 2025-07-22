import React from "react";
import SavedCharts from "../components/SavedCharts";
import AllUploedExels from "../components/ChartUploads/AllUploedExels";
import { useProfilePage } from "../context/ProfilePageContext";

// Optional: You can later move these to their own files.
const WelcomeHeader = () => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
    <p className="text-gray-600">
      Manage your reports, charts, and data uploads here.
    </p>
  </div>
);

const StatsOverview = ({ totalCharts = 0, totalUploads = 0 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div className="bg-[var(--card)] p-4 rounded shadow">
      <p className="text-sm text-gray-500">Charts Saved</p>
      <h2 className="text-xl font-bold">{totalCharts}</h2>
    </div>
    <div className="bg-[var(--card)] p-4 rounded shadow">
      <p className="text-sm text-gray-500">Excel Files Uploaded</p>
      <h2 className="text-xl font-bold">{totalUploads}</h2>
    </div>
  </div>
);

const Charts = () => {
  // TODO: Replace these with real values (e.g., fetched from context or API)
  const { loadingCounts, dashboardCounts, loadingCharts, recentCharts } =
      useProfilePage();
      console.log(dashboardCounts);
      
  const totalCharts = dashboardCounts.chartCount;
  const totalUploads = dashboardCounts.uploadCount;

  return (
    <div className="flex min-h-screen ">
      {/* Left Sidebar */}
      <aside className="w-full md:w-1/4 p-4 border-r border-[var(--border)]">
        <h2 className="text-lg font-semibold mb-4">Uploaded Excel Files</h2>
        <AllUploedExels />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <WelcomeHeader />
        <StatsOverview totalCharts={totalCharts} totalUploads={totalUploads} />
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Saved Charts</h2>
          <SavedCharts />
        </section>
      </main>
    </div>
  );
};

export default Charts;
