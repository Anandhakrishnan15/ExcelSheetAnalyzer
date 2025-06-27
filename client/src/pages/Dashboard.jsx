// Dashboard.jsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { userInfo, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="max-w-xl mx-auto mt-10 card flex items-center justify-center min-h-[200px]">
      {loading ? (
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : !userInfo ? (
        <h2 className="text-red-500">Failed to load user info.</h2>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">Welcome, {userInfo.name}!</h1>
          <p className="text-lg mb-2">
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p className="text-lg">
            <strong>Role:</strong> {userInfo.role}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
