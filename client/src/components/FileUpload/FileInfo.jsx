import React from "react";
import { X } from "lucide-react";

export default function FileInfo({ file, onRemove }) {
  return (
    <div className="w-full border rounded-md p-3 flex justify-between items-center">
      <div>
        <p className="font-medium">{file.name}</p>
        <p className="text-xs text-gray-500">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-1 hover:bg-gray-100 rounded transition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
