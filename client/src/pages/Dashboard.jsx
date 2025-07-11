// Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MyComponent from "../components/ChartUploads/AllUploedExels";

const Dashboard = () => {
  const { userInfo, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("You are not logged in");
      navigate("/Auth");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    // Return nothing so the redirect happens
    return null;
  }

  const leftRef = useRef();
  const rightRef = useRef();

  // Handle click outside left sidebar
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

  // Handle click outside right sidebar
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
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[var(--body)] relative">
      {/* ===== Left Sidebar ===== */}
      <aside
        ref={leftRef}
        className={`
        fixed top-0 left-0 w-64 shadow-lg z-50
        transform transition-transform duration-300 block border-r border-[var(--border)]
        ${
          showLeft
            ? "translate-x-0 bg-[var(--card)] border-[var(--border)] h-full"
            : "-translate-x-full"
        }
        lg:relative lg:translate-x-0 lg:w-1/4  
      `}
      >
        {/* Mobile Header */}
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
          {/* Total Users */}
          <div className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-blue-500">124</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
          {/* Total Uploads */}
          <div className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-green-500">87</div>
            <div className="text-sm text-gray-500">Total Uploads</div>
          </div>
          {/* Reports Downloaded */}
          <div className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-purple-500">45</div>
            <div className="text-sm text-gray-500">Reports Downloaded</div>
          </div>
          {/* Charts Created */}
          <div className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-yellow-500">23</div>
            <div className="text-sm text-gray-500">Charts Created</div>
          </div>
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
