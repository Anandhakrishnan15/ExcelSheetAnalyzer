// excelUploadContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import { getExceldata } from "../services/AuthAPI";
import { useAuth } from "./AuthContext";

// 1️⃣ Create the Context
const ExcelUploadContext = createContext();

// 2️⃣ Create a Provider Component
export const ExcelUploadProvider = ({ children }) => {
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // 3️⃣ Fetch function to get all uploaded Excel data
  const getExcelData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExceldata();
      setExcelData(response.data); 
      console.log(response.data);
      
    } catch (err) {
      console.error("Error fetching Excel data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // when the token get chnages it will get the data fo that perticulaer user
  useEffect(() => {
    getExcelData();
  }, [token]);

  return (
    <ExcelUploadContext.Provider
      value={{
        excelData,
        loading,
        error,
        getExcelData, // expose refetch
      }}
    >
      {children}
    </ExcelUploadContext.Provider>
  );
};

// 5️⃣ Custom hook for easier consumption
export const useExcelUpload = () => {
  return useContext(ExcelUploadContext);
};
