import React from "react";

const DownloadButtons = ({
  handleDownloadPDF,
  handleDownloadImagesZip,
  generatingPDF,
  generatingImg,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={handleDownloadPDF}
        disabled={generatingPDF}
        className={`px-4 py-2 rounded ${
          generatingPDF
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500 text-white"
        }`}
      >
        {generatingPDF ? "Generating PDF..." : "Download PDF Report"}
      </button>
      <button
        onClick={handleDownloadImagesZip}
        disabled={generatingImg}
        className={`px-4 py-2 rounded ${
          generatingImg
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-500 text-white"
        }`}
      >
        {generatingImg ? "Preparing ZIP..." : "Download Images ZIP"}
      </button>
    </div>
  );
};

export default DownloadButtons;
