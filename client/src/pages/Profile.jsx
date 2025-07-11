import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MyComponent from "../components/ChartUploads/AllUploedExels";
import { QuickActions, Tips } from "../components/QuickActions";
// import UserControls from "../components/UserControls";

export const Profile = () => {
  const { userInfo, isLoggedIn, loading, logout } = useAuth();
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
        fixed lg:top-0 md:top-18 left-0 w-64 shadow-lg z-50 overflow-auto 
        transform transition-transform duration-300 block border-r border-[var(--border)]
        ${
          showLeft
            ? "translate-x-0 bg-[var(--card)] border-[var(--border)] h-full"
            : "-translate-x-full"
        }
        lg:relative lg:translate-x-0 lg:w-1/4  scrollbar-none 
      `}
      >
        {/* Mobile Header */}
        <div className="p-4  border-b flex justify-between items-center bg-gray-100 lg:hidden">
          <h2 className="text-lg font-semibold">MyComponent</h2>
          <button
            className="text-sm px-2 py-1 bg-red-500 text-white rounded"
            onClick={() => setShowLeft(false)}
          >
            Close
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-full space-y-4">
          {/*Uploaded Excel Files */}
          <MyComponent />
          {/* Quick Actions */}
          <QuickActions />
          {/* Help / Tips */}
          <Tips />
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

        {/* Main Card */}
        <div className="w-full max-w-xl bg-[var(--card)] rounded-lg shadow p-6 border border-[var(--border)] mb-6">
          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : !userInfo ? (
            <h2 className="text-red-500">Failed to load user info.</h2>
          ) : (
            <div>
              <h1 className="text-3xl font-bold mb-4">
                Welcome, {userInfo.name}!
              </h1>
              <p className="text-lg mb-2">
                <strong>Email:</strong> {userInfo.email}
              </p>
              <p className="text-lg">
                <strong>Role:</strong> {userInfo.role}
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="w-full max-w-xl bg-[var(--card)] rounded-lg shadow p-6 border border-[var(--border)] mb-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {[
              {
                id: 1,
                action: "Uploaded file",
                detail: "sales_data.xlsx",
                date: "2024-07-05",
              },
              {
                id: 2,
                action: "Created chart",
                detail: "Monthly Revenue",
                date: "2024-07-04",
              },
              {
                id: 3,
                action: "Generated report",
                detail: "Q2 Analysis",
                date: "2024-07-03",
              },
            ].map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center p-3 bg-[var(--body)] rounded border border-[var(--border)]"
              >
                <div>
                  <p className="text-sm font-medium">
                    {item.action}: {item.detail}
                  </p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <button
                  className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    // Later: Navigate to detail page
                    alert(`Navigate to ${item.detail}`);
                  }}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
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
    lg:relative lg:translate-x-0 lg:w-64 flex flex-col
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

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {userInfo ? (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">👤 My Profile</h2>
              <p className="text-sm mb-1">
                <strong>Name:</strong> {userInfo.name}
              </p>
              <p className="text-sm mb-1">
                <strong>Email:</strong> {userInfo.email}
              </p>
              <p className="text-sm mb-1">
                <strong>Role:</strong> {userInfo.role}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No user info available.</p>
          )}

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className="w-full text-left px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => navigate("/profile")}
                >
                  View Profile
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => navigate("/upload")}
                >
                  Upload Data
                </button>
              </li>
              {userInfo?.role === "admin" && (
                <li>
                  <button
                    className="w-full text-left px-3 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
                    onClick={() => navigate("/dashboard")}
                  >
                    Admin Dashboard
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/*logout*/}
        <div className="p-4 border-t">
          <button
            className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};
