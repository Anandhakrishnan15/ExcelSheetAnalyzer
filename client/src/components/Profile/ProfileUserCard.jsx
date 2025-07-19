export default function ProfileUserCard({ userInfo }) {
  return (
    <div className="w-full max-w-xl bg-[var(--card)] rounded-lg shadow p-6 border border-[var(--border)] mb-6 flex justify-between items-center space-x-4">
      {/* Left: User Avatar and Info */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white">
          {userInfo?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{userInfo.name}</h1>
          <p className="text-sm text-gray-600">{userInfo.email}</p>
          <p className="text-sm text-gray-600">Role: {userInfo.role}</p>
          <p className="text-xs text-gray-500">
            Joined:{" "}
            {userInfo.createdAt
              ? new Date(userInfo.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Right: Image/PDF Download Totals */}
      <div className="flex flex-col items-end space-y-2">
        <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">
          Images Downloaded: {userInfo.totalImageDownloads ?? 0}
        </div>
        <div className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-full">
          PDFs Downloaded: {userInfo.totalPDFDownloads ?? 0}
        </div>
      </div>
    </div>
  );
}
