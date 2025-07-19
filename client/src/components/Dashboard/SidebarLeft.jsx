import React, { useEffect, useRef, useState } from "react";
// import { useDashboard } from "../../context/DashboardContext";
import { AllAdminOnly } from "../../services/AuthAPI";

const SidebarLeft = ({ showLeft, setShowLeft }) => {
  const leftRef = useRef();
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await AllAdminOnly();
        setAdminUsers(res?.data?.admins || []);
      } catch (err) {
        console.error("Error fetching admin users:", err);
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showLeft &&
        leftRef.current &&
        !leftRef.current.contains(event.target)
      ) {
        setShowLeft(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLeft, setShowLeft]);

  return (
    <aside
      ref={leftRef}
      className={`
        fixed top-0 left-0 w-64 shadow-lg z-50 transform transition-transform duration-300
        border-r border-[var(--border)] bg-[var(--card)] h-full
        ${showLeft ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:w-1/4 overflow-y-auto
      `}
    >
      {/* Mobile Top Bar */}
      <div className="p-4 border-b flex justify-between items-center lg:hidden">
        <h2 className="text-lg font-semibold">Users</h2>
        <button
          className="text-sm px-2 py-1 bg-red-500 text-white rounded"
          onClick={() => setShowLeft(false)}
        >
          Close
        </button>
      </div>

      {/* Admin Users */}
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">All Admins</h2>
        </div>

        {adminUsers.length === 0 ? (
          <p className="text-sm text-[var(--border)]">No admin users found.</p>
        ) : (
          adminUsers.map((user) => (
            <div
              key={user._id}
              className="border border-[var(--border)] rounded p-3 shadow-sm text-sm space-y-1 bg-[var(--card)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{user.name}</p>
                <button
                  onClick={() => console.log("This is the admin ID", user._id)}
                  className={`text-xs px-2 py-0.5 rounded-2xl font-semibold ${
                    user.blocked
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  } cursor-pointer`}
                >
                  {user.blocked ? "Blocked" : "Admin"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 truncate">{user.email}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user._id);
                    console.log("Copied user ID", user._id);
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-xs cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default SidebarLeft;
