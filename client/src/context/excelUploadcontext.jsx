// excelUploadContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import { getExceldata } from "../services/AuthAPI";
import { useAuth } from "./AuthContext";

//  Create the Context
const ExcelUploadContext = createContext();

// Create a Provider Component
export const ExcelUploadProvider = ({ children }) => {
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fetch function to get all uploaded Excel data
  const getExcelData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExceldata();
      const data = response?.data?.uploadedFiles || response?.data;

      setExcelData(data);  
    } catch (err) {
      // console.error("❌ Error fetching Excel data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  
useEffect(() => {
  if (token) {
    getExcelData();
  } else {
    setExcelData([]); 
  }
}, [token]);



  return (
    <ExcelUploadContext.Provider
      value={{
        excelData,
        loading,
        error,
        getExcelData, 
      }}
    >
      {children}
    </ExcelUploadContext.Provider>
  );
};

export const useExcelUpload = () => {
  return useContext(ExcelUploadContext);
};
