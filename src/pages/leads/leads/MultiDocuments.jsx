import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { API } from "../../../Constant";
import { toast } from "react-toastify";


const MultiDocuments = ({ onclose, lead ,onsucess}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!files.length) return;

    try {
      setUploading(true);
      const formData = new FormData();

      files.forEach((file) => formData.append("documents", file));
      formData.append("leadId", lead.lead_id);

      await axios.post(`${API}/lead/upload-documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onsucess();
toast.success("Documents uploaded successfully");
      onclose();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="font-layout-font fixed inset-0 grid z-20 justify-center items-center backdrop-blur-xs">
      <div className="mx-2 p-4 shadow-lg dark:bg-popup-gray bg-layout-light dark:bg-layout-dark rounded-lg relative w-full max-w-md">

        {/* Close */}
        <button
          onClick={onclose}
          className="absolute rounded-full -top-5 -right-4 dark:bg-layout-dark bg-layout-light lg:shadow-md md:shadow-md px-3 py-3"
        >
          <IoClose size={22} />
        </button>

        <h1 className="text-center font-semibold text-xl mb-4 dark:text-white">
          Add Documents
        </h1>

        {/* File input */}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full border rounded-xl text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0
            file:text-sm file:font-semibold
            file:bg-select_layout-dark file:text-white
            hover:file:bg-select_layout-dark/90 mb-4"
        />

        {/* Selected files */}
        {files.length > 0 && (
          <ul className="text-sm mb-4 space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-1"
              >
                <span className="truncate max-w-[240px]">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Existing documents */}
        {lead?.documents?.length > 0 && (
          <div className="mb-4">
            <p className="font-medium text-sm mb-2 dark:text-white">
              Uploaded Documents
            </p>
            <ul className="space-y-2 text-sm">
              {lead.documents.map((doc, i) => (
                <li key={i} className="flex justify-between">
                  <span className="truncate max-w-[200px]">
                    {doc.fileName}
                  </span>

                  {doc.fileType?.startsWith("image/") ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      className="text-blue-500"
                    >
                      View
                    </a>
                  ) : (
                    <a
                      href={doc.fileUrl}
                      download
                      className="text-green-500"
                    >
                      Download
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4 text-sm">
          <button
            onClick={onclose}
            className="border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="bg-select_layout-dark text-white px-6 py-1.5 rounded-sm disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiDocuments;
