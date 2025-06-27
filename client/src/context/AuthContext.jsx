import { createContext, useState, useEffect, useContext } from "react";
import { getMe } from "../services/AuthAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserInfo(null);
  };

  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        setUserInfo(null);
        return;
      }

      try {
        setLoading(true);
        const res = await getMe();
        setUserInfo(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

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
        loading, // ✅ provide loading globally
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
