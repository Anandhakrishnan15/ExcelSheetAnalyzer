export default function ProfileSidebarRight({ userInfo, showRight, setShowRight, navigate, logout }) {
  return (
    <aside
      className={`fixed lg:top-0 md:top-15 right-0 w-64 shadow-lg z-50 overflow-auto
      transform transition-transform duration-300 block border-l border-[var(--border)]
      ${
        showRight
          ? "translate-x-0 bg-[var(--card)] border-[var(--border)] h-full"
          : "translate-x-full"
      }
      lg:relative lg:translate-x-0 scrollbar-none`}
    >
      <div className="p-3 border-b flex justify-between items-center lg:hidden">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <button
          className="text-sm bg-red-500 text-white rounded"
          onClick={() => setShowRight(false)}
        >
          Close
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-4">
        {userInfo ? (
          <div className="bg-[var(--card)] p-3 rounded border border-[var(--border)]">
            <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">Profile</h2>
            <p className="text-sm mb-1"><strong>Name:</strong> {userInfo.name}</p>
            <p className="text-sm mb-1"><strong>Email:</strong> {userInfo.email}</p>
            <p className="text-sm mb-1"><strong>Role:</strong> {userInfo.role}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No user info available.</p>
        )}

        <div className="bg-[var(--card)] p-3 rounded border border-[var(--border)]">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Quick Links</h3>
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

        <div className="bg-[var(--card)] p-3 rounded border border-[var(--border)]">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Account</h3>
          <div className="flex flex-col space-y-2">
            <button className="w-full px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">Edit Profile</button>
            <button className="w-full px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Change Password</button>
            <button className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Delete Account</button>
          </div>
        </div>

        {userInfo?.role === "admin" && (
          <div className="bg-[var(--card)] p-3 rounded border border-[var(--border)]">
            <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Admin Tools</h3>
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full px-3 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm"
            >
              Manage Users
            </button>
          </div>
        )}
      </div>

      <div className="p-3 border-t">
        <button
          className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
