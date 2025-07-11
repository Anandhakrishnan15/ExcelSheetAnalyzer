import { createContext, useState, useEffect, useContext } from "react";
import { getMe } from "../services/AuthAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserInfo(null);
    setIsAdmin(false);
  };

  const isLoggedIn = !!token;

  const fetchUserInfo = async () => {
    if (!token) {
      setUserInfo(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getMe();
      setUserInfo(res.data);
      setIsAdmin(res.data.role === "admin");
    } catch (error) {
      console.error("Error fetching user info:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isLoggedIn,
        userInfo,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
