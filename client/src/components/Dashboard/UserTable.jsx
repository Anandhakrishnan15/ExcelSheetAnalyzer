import {
  FileText,
  BarChart3,
  Upload,
  Image,
  FileDown,
  Box,
  Ban,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { globalUsers, searchUsers } from "../../services/AuthAPI";
import { useAdminUserActions } from "../../context/AdminUserActionsContext";
// import { toast } from "react-toastify";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceTimer = useRef(null);
  const observer = useRef();
  const navigate = useNavigate();
  const { blockUser, deleteUser } = useAdminUserActions();
  const [popup, setPopup] = useState({
    show: false,
    userId: null,
    action: null,
  });

const fetchUsers = useCallback(async () => {
  if (loading || !hasMore) return;

  setLoading(true);
  try {
    const res = await globalUsers(page, 5);
    const newUsers = res?.data?.data || [];

    setUsers((prev) => {
      const existingIds = new Set(prev.map((u) => u._id));
      const filteredNewUsers = newUsers.filter((u) => !existingIds.has(u._id));
      return [...prev, ...filteredNewUsers];
    });

    setHasMore(newUsers.length > 0);
  } catch (err) {
    console.error("Fetch users failed:", err);
  } finally {
    setLoading(false);
  }
}, [page, loading, hasMore]);


  const runSearch = async (q) => {
    try {
      setLoading(true);
      const res = await searchUsers(q);
      const searchedUsers = res?.users || [];
      console.log(searchedUsers);
      
      setUsers(searchedUsers);
      setHasMore(false);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const trimmed = query.trim();
      if (!trimmed) {
        // setUsers([]);
        setPage(1);
        setHasMore(true);
        fetchUsers(true);
      } else {
        runSearch(trimmed);
      }
    }, 800);

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  useEffect(() => {
    if (!query) fetchUsers();
  }, [page]);

  const lastUserRef = useCallback(
    (node) => {
      if (loading || !hasMore || query) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, query]
  );

const handleConfirmAction = async () => {
  try {
    if (popup.action === "Block") {
      await blockUser(popup.userId);
    } else if (popup.action === "Delete") {
      await deleteUser(popup.userId);
    }
  } catch (err) {
    console.error(`${popup.action} failed:`, err);
  } finally {
    setPopup({ show: false, userId: null, action: null });
    setUsers([]); // Reset users so fetchUsers can reload updated data
    setPage(1);
    setHasMore(true);
  }
};


  const openPopup = (userId, action) =>
    setPopup({ show: true, userId, action });

  const closePopup = () =>
    setPopup({ show: false, userId: null, action: null });

  const goToUserProfile = (userId, userData) => {
    navigate(`/admin/user/${userId}`, { state: { user: userData } });
  };

  return (
    <div className="w-full overflow-x-auto relative p-4">
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or ID..."
          className="w-full sm:w-80 border px-3 py-2 rounded"
        />
      </div>

      <table className="min-w-full text-sm">
        <thead className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-20">
          <tr>
            <th className="text-left p-3 font-semibold">User Info</th>
            <th className="text-left p-3 font-semibold">Usage Stats</th>
            <th className="text-center p-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && !loading && (
            <tr>
              <td colSpan="3" className="p-4 text-center">
                No users found.
              </td>
            </tr>
          )}

          {users.map((user, index) => {
            const isLast = index === users.length - 1;
            return (
              <tr
                key={user._id}
                ref={isLast ? lastUserRef : null}
                className="border-b border-[var(--border)] hover:bg-[var(--hover)]"
              >
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
                <td className="p-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <StatBadge
                      label="Reports"
                      count={user.reportCount}
                      icon={<FileText size={14} />}
                      color="blue"
                    />
                    <StatBadge
                      label="Charts"
                      count={user.chartCount}
                      icon={<BarChart3 size={14} />}
                      color="green"
                    />
                    <StatBadge
                      label="Uploads"
                      count={user.uploadCount}
                      icon={<Upload size={14} />}
                      color="yellow"
                    />
                    <StatBadge
                      label="Image Downloads"
                      count={user.totalGraphImageDownloads}
                      icon={<Image size={14} />}
                      color="purple"
                    />
                    <StatBadge
                      label="PDF Downloads"
                      count={user.totalGraphPDFDownloads}
                      icon={<FileDown size={14} />}
                      color="red"
                    />
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-2 justify-center">
                    <ActionButton
                      label={user.blocked ? "Un-Block" : "Block"}
                      icon={
                        user.blocked ? <Box size={16} /> : <Ban size={16} />
                      }
                      color="red"
                      onClick={() => openPopup(user._id, "Block")}
                    />
                    <ActionButton
                      label="Delete"
                      icon={<Trash2 size={16} />}
                      color="gray"
                      onClick={() => openPopup(user._id, "Delete")}
                    />
                    <ActionButton
                      label="Toggle Admin"
                      icon={<ShieldCheck size={16} />}
                      color="blue"
                      onClick={() => goToUserProfile(user._id, user)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}

          {loading && (
            <tr>
              <td colSpan="3" className="p-4 text-center">
                Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {popup.show && (
        <PopUpCard
          action={popup.action}
          onConfirm={handleConfirmAction}
          onCancel={closePopup}
        />
      )}
    </div>
  );
};

const StatBadge = ({ label, count, icon, color }) => (
  <div className="relative group">
    <div
      className={`px-2 py-1 rounded-full bg-${color}-100 text-${color}-800 text-xs flex items-center gap-1`}
    >
      {icon} {count}
    </div>
    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
      {label}
    </div>
  </div>
);

const ActionButton = ({ label, icon, color, onClick }) => (
  <div className="relative group">
    <button
      className={`flex items-center gap-1 px-2 py-1 bg-${color}-500 text-white rounded hover:bg-${color}-600`}
      onClick={onClick}
    >
      {icon}
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
      {label}
    </div>
  </div>
);

const PopUpCard = ({ action, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-100">
    <div className="bg-[var(--card)] rounded-xl shadow-lg p-6 max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
      <p className="text-sm mb-6">
        Are you sure you want to <span className="font-bold">{action}</span>{" "}
        this user?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-1 text-sm border rounded hover:bg-[var(--border)]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default UserTable;
