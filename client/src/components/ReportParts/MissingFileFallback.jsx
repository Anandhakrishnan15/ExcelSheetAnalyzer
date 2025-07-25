// src/components/ReportParts/MissingFileFallback.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MissingFileFallback = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-96">
      <p className="text-gray-500 mb-4">No chart data found for this report.</p>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go Back to Dashboard
      </button>
    </div>
  );
};

export default MissingFileFallback;
