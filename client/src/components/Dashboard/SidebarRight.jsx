// components/Dashboard/SidebarRight.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SidebarRight = ({ showRight, setShowRight }) => {
  const rightRef = useRef();
  const navigate = useNavigate();

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
      <div className="p-4 border-b flex justify-between items-center bg-gray-100 lg:hidden">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <button
          className="text-sm px-2 py-1 bg-red-500 text-white rounded"
          onClick={() => setShowRight(false)}
        >
          Close
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-full space-y-4">
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
  );
};

export default SidebarRight;
