import { useRef, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProfilePage } from "../context/ProfilePageContext";

import ProfileSidebarLeft from "../components/Profile/ProfileSidebarLeft";
import ProfileSidebarRight from "../components/Profile/ProfileSidebarRight";
import ProfileUserCard from "../components/Profile/ProfileUserCard";
import ProfileCountsGrid from "../components/Profile/ProfileCountsGrid";
import ProfileRecentCharts from "../components/Profile/ProfileRecentCharts";
import ProfileRecentReports from "../components/Profile/ProfileRecentReports";
import MyComponent from "../components/ChartUploads/AllUploedExels";
import { toast } from "react-toastify";


export const Profile = () => {
  const { userInfo, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const { loadingCounts, dashboardCounts, loadingCharts, recentCharts } =
    useProfilePage();

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const leftRef = useRef();
  const rightRef = useRef();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast.warn("⚠️ You are not logged in");
      navigate("/Auth");
    }
  }, [isLoggedIn, navigate]);

  // Close sidebars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showLeft &&
        leftRef.current &&
        !leftRef.current.contains(event.target)
      ) {
        setShowLeft(false);
      }
      if (
        showRight &&
        rightRef.current &&
        !rightRef.current.contains(event.target)
      ) {
        setShowRight(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLeft, showRight]);

  if (!isLoggedIn) return null;

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[var(--body)] relative">
        {/* Left Sidebar */}
        <ProfileSidebarLeft
          showLeft={showLeft}
          setShowLeft={setShowLeft}
          leftRef={leftRef}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col md:items-center h-[110vh] p-6 overflow-y-auto scrollbar-none">
          <div className="flex justify-between gap-2 mb-4 lg:hidden">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => setShowLeft(true)}
            >
              Open Uploads
            </button>
            <button
              className="px-3 py-1 bg-amber-600 text-white rounded"
              onClick={() => setShowRight(true)}
            >
              Open Sidebar
            </button>
          </div>

          {/* User Card */}
          <ProfileUserCard
            userInfo={{
              ...userInfo,
              totalImageDownloads: loadingCounts
                ? 0
                : dashboardCounts?.totalImageDownloads || 0,
              totalPDFDownloads: loadingCounts
                ? 0
                : dashboardCounts?.totalPDFDownloads || 0,
            }}
          />

          {/* Counts Grid */}
          <ProfileCountsGrid
            dashboardCounts={dashboardCounts}
            loadingCounts={loadingCounts}
          />

          {/* Uploaded Files */}
          <div className="w-full max-w-xl bg-[var(--card)] rounded-lg shadow p-6 border border-[var(--border)] mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Recent Uploaded Files
            </h2>
            <MyComponent />
          </div>

          {/* Recent Charts */}
          <ProfileRecentCharts
            recentCharts={recentCharts}
            loadingCharts={loadingCharts}
            navigate={navigate}
          />

          {/* Reports */}
          <ProfileRecentReports />
        </main>

        {/* Right Sidebar */}
        <ProfileSidebarRight
          userInfo={userInfo}
          showRight={showRight}
          setShowRight={setShowRight}
          navigate={navigate}
          logout={logout}
        />
      </div>
    </>
  );
};
