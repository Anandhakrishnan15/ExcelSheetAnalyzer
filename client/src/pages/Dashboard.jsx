import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import SidebarRight from "../components/Dashboard/SidebarRight";
import DashboardStats from "../components/Dashboard/DashboardStats";
import UserTable from "../components/Dashboard/UserTable";
import { searchUsers } from "../services/AuthAPI";

const Dashboard = () => {
  const { isLoggedIn, loading: authLoading } = useAuth();
  // const { totals, perUser, loading: dashboardLoading, error } = useDashboard();
  const navigate = useNavigate();

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn && !authLoading) {
      alert("You are not logged in");
      navigate("/Auth");
    }
  }, [isLoggedIn, authLoading, navigate]);


  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[var(--body)] relative">
      {/* SidebarLeft */}
      <SidebarLeft showLeft={showLeft} setShowLeft={setShowLeft} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:items-center p-6 overflow-y-auto">
        <div className="flex justify-between gap-2 mb-4 lg:hidden">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => setShowLeft(true)}
          >
            Open Users
          </button>
          <button
            className="px-3 py-1 bg-amber-600 text-white rounded"
            onClick={() => setShowRight(true)}
          >
            Open Stats
          </button>
        </div>

        <DashboardStats />
        <UserTable />
      </main>

      {/* SidebarRight */}
      <SidebarRight showRight={showRight} setShowRight={setShowRight} />
    </div>
  );
};

export default Dashboard;
