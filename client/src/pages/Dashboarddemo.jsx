import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import MyComponent from "../components/ChartUploads/AllUploedExels";
import { SquareArrowOutUpRight } from "lucide-react";
import {
  Ban,
  Trash2,
  ShieldCheck,
  FileText,
  BarChart3,
  Upload,
  Image,
  FileDown,
} from "lucide-react";

const Dashboard = () => {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { totals, perUser, loading: dashboardLoading, error } = useDashboard();
  const navigate = useNavigate();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [searchUSer, setSearchuser] = useState("");
  const [filterRole, setFilterRole] = useState("");
const [visibleUsers, setVisibleUsers] = useState(10);

  useEffect(() => {
    if (!isLoggedIn && !authLoading) {
      alert("You are not logged in");
      navigate("/Auth");
    }
  }, [isLoggedIn, authLoading, navigate]);

  const leftRef = useRef();
  const rightRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showLeft &&
        leftRef.current &&
        !leftRef.current.contains(event.target)
      ) {
        setShowLeft(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLeft]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showRight &&
        rightRef.current &&
        !rightRef.current.contains(event.target)
      ) {
        setShowRight(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showRight]);
  useEffect(() => {
    setVisibleUsers(10);
  }, [searchUSer, filterRole]);

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading dashboard data: {error}
      </div>
    );
  }
const handleMakeAdmin = async (userId) => {
  try {
    await axios.put(`/api/users/${userId}/make-admin`);
    toast.success("User promoted to admin!");
    // Optionally refresh user data
  } catch (err) {
    toast.error("Failed to make admin");
  }
};

const filteredUsers = perUser.filter((user) => {
  const matchSearch =
    user.name?.toLowerCase().includes(searchUSer.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchUSer.toLowerCase()) ||
    user._id?.toLowerCase().includes(searchUSer.toLowerCase());

  const matchRole = filterRole ? user.role === filterRole : true;

  return matchSearch && matchRole;
});


  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[var(--body)] relative">
      {/* ===== Left Sidebar ===== */}
      <aside
        ref={leftRef}
        className={`fixed top-0 left-0 w-64 shadow-lg z-50 transform transition-transform duration-300 block border-r border-[var(--border)] ${
          showLeft
            ? "translate-x-0 bg-[var(--card)] border-[var(--border)] h-full"
            : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-1/4`}
      >
        <div className="p-4 border-b flex justify-between items-center bg-gray-100 lg:hidden">
          <h2 className="text-lg font-semibold">MyComponent</h2>
          <button
            className="text-sm px-2 py-1 bg-red-500 text-white rounded"
            onClick={() => setShowLeft(false)}
          >
            Close
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-full">
          <MyComponent />
          <div className="w-full border border-[var(--border)] mt-2 p-4 bg-[var(--card)] rounded overflow-auto h-100 scrollbar-none">
            <h2>All Users</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={searchUSer}
              onChange={(e) => setSearchuser(e.target.value)}
              className="w-full p-1 mb-4 rounded border border-[var(--border)] bg-transparent outline-none"
            />

            {dashboardLoading ? (
              <div className="border border-[var(--border)]">
                Loading user data...
              </div>
            ) : (
              <>
                {filteredUsers.slice(0, visibleUsers).map((user) => (
                  <div
                    className="border border-[var(--border)] p-2 mb-2.5"
                    key={user._id}
                  >
                    <div className="flex items-center gap-2">
                      <p className="m-0">{user.name}</p>
                      <div
                        className={`w-2 h-2 ${
                          user.role === "user" ? "bg-red-500" : "bg-green-500"
                        } rounded-full`}
                      />
                    </div>
                    <p>{user._id}</p>
                    <button
                      onClick={() => navigate(`/user/${user._id}`)}
                      className="hover:text-blue-500"
                      title="View user"
                    >
                      <SquareArrowOutUpRight />
                    </button>
                  </div>
                ))}

                {perUser.length > visibleUsers && (
                  <div className="flex justify-center mt-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => setVisibleUsers((prev) => prev + 10)}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 flex flex-col md:items-center p-6 overflow-y-auto">
        {/* Mobile Toggle Buttons */}
        <div className="flex justify-between gap-2 mb-4 lg:hidden">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => setShowLeft(true)}
          >
            Open MyComponent
          </button>
          <button
            className="px-3 py-1 bg-amber-600 text-white rounded"
            onClick={() => setShowRight(true)}
          >
            Open Sidebar
          </button>
        </div>

        {/* Summary Stats */}
        <div className="w-full max-w-xl grid grid-cols-2 gap-4 mb-6">
          {/* Total Reports */}
          <div className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-blue-500">
              {dashboardLoading ? "..." : totals.totalReports}
            </div>
            <div className="text-sm text-gray-500">Total Reports</div>
          </div>
          {/* Total Charts */}
          <div className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-green-500">
              {dashboardLoading ? "..." : totals.totalCharts}
            </div>
            <div className="text-sm text-gray-500">Total Charts</div>
          </div>
          {/* Total Uploads */}
          <div className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-purple-500">
              {dashboardLoading ? "..." : totals.totalUploads}
            </div>
            <div className="text-sm text-gray-500">Total Uploads</div>
          </div>
          {/* Image Downloads */}
          <div className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-yellow-500">
              {dashboardLoading ? "..." : totals.totalImageDownloads}
            </div>
            <div className="text-sm text-gray-500">Image Downloads</div>
          </div>
          {/* PDF Downloads */}
          <div className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow col-span-2">
            <div className="text-2xl font-bold text-pink-500">
              {dashboardLoading ? "..." : totals.totalPDFDownloads}
            </div>
            <div className="text-sm text-gray-500">PDF Downloads</div>
          </div>
        </div>
        {/* Per User Table */}
        <div className="flex w-full justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchUSer}
            onChange={(e) => setSearchuser(e.target.value)}
            className="w-1/2 p-1 rounded border border-[var(--border)] bg-transparent outline-none"
          />

          <select
            className="p-1 border rounded bg-transparent border-[var(--border)] text-sm"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="w-full max-w-6xl overflow-x-auto h-80 scrollbar-none border border-[var(--border)] rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-20">
              <tr>
                <th className="text-left p-3 font-semibold">User Info</th>
                <th className="text-left p-3 font-semibold">Usage Stats</th>
                <th className="text-center p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardLoading ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center">
                    Loading user data...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-[var(--border)] hover:bg-[var(--hover)]"
                  >
                    {/* User Info */}
                    <td className="p-3">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div
                        className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {user.role}
                      </div>
                    </td>

                    {/* Usage Stats */}
                    <td className="p-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                        {/* Reports */}
                        <div className="relative group">
                          <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center gap-1">
                            <FileText size={14} /> {user.reportCount}
                          </div>
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                            Reports
                          </div>
                        </div>

                        {/* Charts */}
                        <div className="relative group">
                          <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs flex items-center gap-1">
                            <BarChart3 size={14} /> {user.chartCount}
                          </div>
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                            Charts
                          </div>
                        </div>

                        {/* Uploads */}
                        <div className="relative group">
                          <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs flex items-center gap-1">
                            <Upload size={14} /> {user.uploadCount}
                          </div>
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                            Uploads
                          </div>
                        </div>

                        {/* Image Downloads */}
                        <div className="relative group">
                          <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs flex items-center gap-1">
                            <Image size={14} /> {user.totalGraphImageDownloads}
                          </div>
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                            Image Downloads
                          </div>
                        </div>

                        {/* PDF Downloads */}
                        <div className="relative group">
                          <div className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs flex items-center gap-1">
                            <FileDown size={14} /> {user.totalGraphPDFDownloads}
                          </div>
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                            PDF Downloads
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        {/* Block Button */}
                        <div className="relative group">
                          <button
                            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => console.log("Block user", user._id)}
                          >
                            <Ban size={16} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                            Block User
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="relative group">
                          <button
                            className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            onClick={() => console.log("Delete user", user._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                            Delete User
                          </div>
                        </div>

                        {/* Toggle Admin Button */}
                        <div className="relative group">
                          <button
                            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() =>
                              console.log("Toggle Admin", user._id)
                            }
                          >
                            <ShieldCheck size={16} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                            Admin
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ===== Right Sidebar ===== */}
      <aside
        ref={rightRef}
        className={`
    fixed top-0 right-0 w-64 shadow-lg z-50
    transform transition-transform duration-300 lg:block border-l border-[var(--border)]
    ${
      showRight
        ? "translate-x-0 bg-[var(--card)] h-full border-[var(--border)]"
        : "translate-x-full"
    }
    lg:relative lg:translate-x-0 lg:w-1/4
  `}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-100 lg:hidden">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <button
            className="text-sm px-2 py-1 bg-red-500 text-white rounded"
            onClick={() => setShowRight(false)}
          >
            Close
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 overflow-y-auto max-h-full space-y-4">
          {/* Quick Actions */}
          <div className="bg-[var(--card)] p-4 rounded shadow border border-[var(--border)]">
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <button
                className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                onClick={() => navigate("/upload")}
              >
                Upload New File
              </button>
              <button
                className="w-full px-3 py-2 bg-amber-500 text-white text-sm rounded hover:bg-amber-600"
                onClick={() => navigate("/charts")}
              >
                View My Charts
              </button>
              <button
                className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                onClick={() => navigate("/reports")}
              >
                Generate Report
              </button>
              <button
                className="w-full px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                onClick={() => navigate("/settings")}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Help / Tips */}
          <div className="bg-[var(--card)] p-4 rounded shadow border border-[var(--border)]">
            <h2 className="text-lg font-semibold mb-3">Helpful Tips</h2>
            <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
              <li>Use Quick Actions to jump between sections.</li>
              <li>Upload Excel files to create new charts.</li>
              <li>Access your reports anytime from the Reports page.</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;


