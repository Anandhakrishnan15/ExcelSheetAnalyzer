import React from "react";
import { Upload } from "lucide-react";

export default function DropzoneArea({ getRootProps, getInputProps, open }) {
  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed dark:border-gray-700 rounded-lg p-6 cursor-pointer transition hover:border-primary flex flex-col items-center justify-center"
      onClick={open}
    >
      <input {...getInputProps()} />
      <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400 mb-2" />
      <p className="text-sm font-medium">Drag & drop Excel/CSV here</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        or click to browse
      </p>
    </div>
  );
}
