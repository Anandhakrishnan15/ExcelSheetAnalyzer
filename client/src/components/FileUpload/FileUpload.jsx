"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Code, Table, Download } from "lucide-react";
import { uploadExcel } from "../../services/AuthAPI";
import DropzoneArea from "./DropzoneArea";
import FileInfo from "./FileInfo";
import DataPreview from "./DataPreview";
import * as XLSX from "xlsx";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newFile = acceptedFiles[0];
      setFile(newFile);
      setJsonData(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];

          const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

          if (json.length === 0) {
            console.warn("No data found in sheet.");
            setJsonData({ fields: [], rows: [] });
            return;
          }

          const fields = Object.keys(json[0]);

          setJsonData({ fields, rows: json });
        } catch (error) {
          console.error("Error parsing file:", error);
        }
      };
      reader.readAsArrayBuffer(newFile);
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
  });

  // Global drag listeners
  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
    };
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        onDrop(Array.from(e.dataTransfer.files));
        e.dataTransfer.clearData();
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onDrop]);

  const handleDownloadJSON = () => {
    if (!jsonData) return;
    const blob = new Blob([JSON.stringify(jsonData.rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadClick = async () => {
    try {
      if (!file) {
        alert("Please select a file before uploading.");
        return;
      }
      const payload = {
        fileName: file.name,
        rows: jsonData.rows,
      };
      const res = await uploadExcel(payload);
      alert(`${file.name} has been uploaded to the database.`);
      console.log("Upload successful:", res);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check the console for details.");
    }
  };

  return (
    <div className=" w-full flex flex-col md:flex-row bg-[var(--bg)] text-[var(--text)]">
      {/* Global Drag Overlay */}
      {!file && isDraggingOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 pointer-events-none">
          <p className="text-white text-lg font-semibold">
            Drop your file to upload
          </p>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-full md:w-64 p-4 flex flex-col gap-2">
        <button
          onClick={() => setShowTable(!showTable)}
          className="flex items-center gap-2 px-3 py-2 border rounded text-sm"
        >
          {showTable ? (
            <>
              <Code className="h-4 w-4" />
              Show JSON
            </>
          ) : (
            <>
              <Table className="h-4 w-4" />
              Show Table
            </>
          )}
        </button>
        <button
          onClick={handleDownloadJSON}
          className="flex items-center gap-2 px-3 py-2 border rounded text-sm"
        >
          <Download className="h-4 w-4" />
          Download JSON
        </button>
        <button
          onClick={handleUploadClick}
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-green-700 hover:shadow-lg active:scale-95"
        >
          Upload
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        {!file && (
          <DropzoneArea
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            open={open}
          />
        )}
        {file && (
          <FileInfo
            file={file}
            onRemove={() => {
              setFile(null);
              setJsonData(null);
            }}
          />
        )}
        {jsonData && <DataPreview jsonData={jsonData} showTable={showTable} />}
      </div>
    </div>
  );
}
