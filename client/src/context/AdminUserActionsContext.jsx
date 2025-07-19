import { createContext, useContext } from "react";
import {
  toggleBlockUser,
  changeUserRole,
  deleteUser as deleteUserAPI,
  revokeUserAccess,
} from "../services/AuthAPI"; // <-- adjust the path if needed
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminUserActionsContext = createContext();

export const AdminUserActionsProvider = ({ children }) => {
  const navigate = useNavigate();

  const blockUser = async (userId) => {
    try {
      const res = await toggleBlockUser(userId);
      toast.success(res.message || "User block status toggled");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to block/unblock user"
      );
    }
  };

  const makeAdmin = async (userId) => {
    try {
      const res = await changeUserRole(userId, "admin");
      toast.success(res.message || "User is now Admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change user role");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This action is irreversible.")) return;
    try {
      const res = await deleteUserAPI(userId);
      toast.success(res.message || "User deleted");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const revokeAccess = async (userId) => {
    try {
      const res = await revokeUserAccess(userId);
      toast.success(res.message || "Access revoked");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to revoke access");
    }
  };

  return (
    <AdminUserActionsContext.Provider
      value={{ blockUser, makeAdmin, deleteUser, revokeAccess }}
    >
      {children}
    </AdminUserActionsContext.Provider>
  );
};

export const useAdminUserActions = () => useContext(AdminUserActionsContext);
