import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../services/AuthAPI";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAdminUserActions } from "../context/AdminUserActionsContext";

const AdminUserProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReports, setShowReports] = useState(false);
const { blockUser, makeAdmin, deleteUser, revokeAccess } =
  useAdminUserActions();
const handleBlockToggle = async () => {
  await blockUser(id);
  setData((prev) => ({
    ...prev,
    user: { ...prev.user, isBlocked: !prev.user.isBlocked },
  }));
};

const handleRoleChange = async () => {
  const newRole = data.user.role === "admin" ? "user" : "admin";
  await makeAdmin(id); // only promoting to admin
  setData((prev) => ({
    ...prev,
    user: { ...prev.user, role: "admin" },
  }));
};

const handleDeleteUser = async () => {
  await deleteUser(id);
};

const handleRevokeAccess = async () => {
  await revokeAccess(id);
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUserById(id);
        setData(result);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!data) return <p className="text-center mt-10">No data found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Panel */}
      <div className="bg-[var(--card)] shadow rounded-2xl p-6 col-span-1">
        <h2 className="text-xl font-bold mb-4">User Info</h2>

        {/* Top Section: Info */}
        <div className="space-y-2 text-sm mb-6">
          <p>
            <strong>Name:</strong> {data.user.name}
          </p>
          <p>
            <strong>Email:</strong> {data.user.email}
          </p>
          <p>
            <strong>Role:</strong> {data.user.role || "user"}
          </p>
          <p>
            <strong>Account Created:</strong>{" "}
            {new Date(data.user.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Blocked:</strong> {data.user.isBlocked ? "Yes" : "No"}
          </p>
          <p>
            <strong>Total Image Downloads:</strong>{" "}
            {data.totals.downloadedImages}
          </p>
          <p>
            <strong>Total PDF Downloads:</strong> {data.totals.downloadedPDFs}
          </p>
          <p>
            <strong>Total AI Reports:</strong> {data.reports.length}
          </p>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleBlockToggle}
            className="bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-600"
          >
            {data.user.isBlocked ? " Unblock User" : "🚫 Block User"}
          </button>

          <button
            onClick={handleRoleChange}
            className="bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600"
          >
            🛡️ {data.user.role === "admin" ? "Already Admin" : "Make Admin"}
          </button>

          <button
            onClick={handleDeleteUser}
            className="bg-gray-600 text-white rounded-xl px-4 py-2 hover:bg-gray-700"
          >
            ❌ Delete Account
          </button>

          <button
            onClick={handleRevokeAccess}
            className="bg-yellow-500 text-white rounded-xl px-4 py-2 hover:bg-yellow-600"
          >
            🔒 Revoke Access
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="col-span-2 space-y-6">
        {/* Saved Charts */}
        <div className="bg-[var(--card)]  shadow rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Saved Charts</h3>
          {data.savedCharts.length === 0 ? (
            <p className="text-gray-500">No charts saved yet.</p>
          ) : (
            <ul className="space-y-4">
              {data.savedCharts.map((chart, index) => (
                <li key={index} className="p-4 border rounded-xl">
                  <p>
                    <strong>Title:</strong> {chart.title}
                  </p>
                  <p>
                    <strong>Type:</strong> {chart.type}
                  </p>
                  <p>
                    <strong>Image Downloads:</strong>{" "}
                    {chart.downloedGraphIMages}
                  </p>
                  <p>
                    <strong>PDF Downloads:</strong> {chart.downloedGraphPDF}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Uploaded Files */}
        <div className="bg-[var(--card)] shadow rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
          {data.uploadedFiles.length === 0 ? (
            <p className="text-gray-500">No files uploaded yet.</p>
          ) : (
            <ul className="space-y-4">
              {data.uploadedFiles.map((file, index) => (
                <li key={index} className="p-4 border rounded-xl">
                  <p>
                    <strong>File Name:</strong> {file.fileName}
                  </p>
                  <p>
                    <strong>Rows:</strong> {file.rows.length}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* AI Reports Dropdown */}
        {/* AI Reports Dropdown */}
        <div className="bg-[var(--card)] shadow rounded-2xl p-6">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowReports(!showReports)}
          >
            <h3 className="text-xl font-semibold">AI Reports</h3>
            {showReports ? <ChevronUp /> : <ChevronDown />}
          </div>

          {showReports && (
            <>
              {data.reports.length === 0 ? (
                <p className="mt-4 text-gray-500">
                  This user has not generated any AI reports yet.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {data.reports.map((report, index) => (
                    <li
                      key={index}
                      className="p-4 border rounded-xl bg-gray-50"
                    >
                      <p>
                        <strong>Chart:</strong> {report.title}
                      </p>
                      <p>
                        <strong>Generated Report:</strong>{" "}
                        {report.generatedReport}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfile;
