/* eslint-disable react/prop-types */
import { useState } from "react";
import { Upload, X, File } from "lucide-react";

const FileUpload = ({
  onChange,
  accept = "image/*,application/pdf",
  maxSize = 2,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleFile = (newFile) => {
    setError("");
    if (!newFile) return;

    if (newFile.size > maxSize * 1024 * 1024) {
      setError(`File must be less than ${maxSize}MB`);
      return;
    }

    setFile(newFile);
    onChange?.(newFile);
  };

  const removeFile = () => {
    setFile(null);
    onChange?.(null);
  };

  const getFilePreview = (file) => {
    if (file?.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  if (file) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachment
        </label>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            {getFilePreview(file) ? (
              <div className="w-20 h-20 relative">
                <img
                  src={getFilePreview(file)}
                  alt={file.name}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            ) : (
              <File className="w-12 h-12 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Attachment (Max {maxSize}MB)
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleChange}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex text-sm text-gray-600 justify-center">
            <span className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
              Upload a file
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {accept.split(",").join(", ")} up to {maxSize}MB
          </p>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
