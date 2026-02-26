import React, { useEffect, useState } from "react";
import NavBar from "../../component/NavBar";
import { AlertTriangle, File, Download, Paperclip, Eye } from "lucide-react";
import { HiArrowsUpDown } from "react-icons/hi2";
import axios from "axios";
import { API, formatDate } from "../../Constant";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewTasks = () => {
  const [comments, setComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const location = useLocation();
  const [taskData, setTaskData] = useState(location.state?.task || {});
  const navigate = useNavigate();
  const loggedInUserId = JSON.parse(localStorage.getItem("employee"));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API}/employee/getallemployees`);
        setUsers(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch employees");
      }
    };
    fetchEmployees();
  }, []);

  const getEmployeeNames = (ids) => {
    if (!ids) return "N/A";
    if (Array.isArray(ids)) {
      return ids
        .map((id) => users.find((u) => u.employee_id === id)?.name || id)
        .join(", ");
    }
    return users.find((u) => u.employee_id === ids)?.name || ids;
  };

  const isCreator = loggedInUserId?.department === "admin";
  const displayLabel = isCreator ? "Assigned To" : "Created By";
  const displayValue = isCreator
    ? getEmployeeNames(taskData?.assigned_to)
    : taskData?.created_by;

  const handleMarkComplete = async (taskData) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this task as complete?",
    );
    if (!confirmed) {
      toast.info("Task completion cancelled");
      return;
    }

    try {
      await axios.patch(`${API}/task/updatetask/${taskData._id}/status`, {
        status: "completed",
      });
      navigate("..");
      toast.success("Task marked as complete");
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to update status");
      toast.error("Failed to update task status");
    }
  };

  const handleAddComment = async (newCommentData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("comment", newCommentData.comment);
      formData.append("taskId", taskData._id);
      formData.append(
        "commented_by",
        loggedInUserId?.name || loggedInUserId?._id,
      );

      if (newCommentData.file) {
        formData.append("file", newCommentData.file);
      }

      const res = await axios.post(
        `${API}/task/addcomment/${taskData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // ✅ FIXED: Handle both response structures safely
      const newComment = {
        comment: res.data.data?.comment || newCommentData.comment,
        date: res.data.data?.comment?.date || new Date(),
        time:
          res.data.data?.comment?.time ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        commented_by: getEmployeeNames(
          loggedInUserId?.employee_id || loggedInUserId?._id,
        ),
        filePath: res.data.data?.comment?.filePath,
        _id: res.data.data?.comment?._id || Date.now().toString(),
      };

      setTaskData((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));

      setComments(false);
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar title="tasks" pagetitle="View Tasks" />
      <div className="flex justify-end">
        {taskData?.status !== "completed" && (
          <button
            onClick={() => handleMarkComplete(taskData)}
            className="cursor-pointer flex items-center dark:text-white gap-2 bg-select_layout-dark px-4 py-2 text-sm rounded-md"
          >
            <div className="relative w-6 h-6">
              <File className="absolute w-6 h-6" />
              <AlertTriangle className="absolute left-1.5 top-2 w-3 h-3" />
            </div>
            <span>Mark as complete</span>
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-3 my-3 dark:text-white text-black">
        <div className="bg-layout-light dark:bg-layout-dark p-4 rounded-md">
          <p className="text-2xl text-center font-bold mb-3">Title</p>
          {[
            { name: "Task", value: taskData.task_title || "N/A" },
            {
              name: "Start Date",
              value: formatDate(taskData?.start_date) || "N/A",
            },
            {
              name: "Due Date",
              value: formatDate(taskData?.due_date) || "N/A",
            },
            { name: "Status", value: taskData?.status || "N/A" },
            {
              name: displayLabel,
              value: displayValue,
            },
            { name: "Note", value: taskData?.note || "N/A" },
          ].map((heading, index) => (
            <div
              key={index}
              className="grid grid-cols-2 text-xs space-y-1 px-3"
            >
              <p>{heading.name}</p>
              <p className="text-end text-gray-500">{heading.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-layout-light dark:bg-layout-dark p-4 rounded-md">
          <p className="text-2xl text-center font-bold mb-3">Attachments</p>
          {taskData?.attachments && taskData.attachments.length > 0 ? (
            taskData.attachments.map((file, index) => {
              const fileUrl = file.filePath;
              return (
                <div
                  key={file._id || index}
                  className="grid grid-cols-2 text-xs space-y-1 px-3"
                >
                  <p>File {index + 1}</p>
                  <p className="text-end">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      View
                    </a>
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No Attachments</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-5 items-center">
        <p className="text-lg font-bold text-black dark:text-white">Comments</p>
        <button
          onClick={() => setComments(true)}
          disabled={loading}
          className="cursor-pointer flex items-center dark:text-white gap-2 bg-layout-light dark:bg-layout-dark w-fit px-4 py-2 text-sm rounded-md disabled:opacity-50"
        >
          <div className="relative w-6 h-6">
            <File className="absolute w-6 h-6" />
            <AlertTriangle className="absolute left-1.5 top-2 w-3 h-3" />
          </div>
          Add Comment
        </button>
      </div>

      <div className="font-layout-font overflow-auto no-scrollbar my-3">
        <table className="w-full xl:h-fit dark:text-white whitespace-nowrap">
          <thead>
            <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
              <th className="p-3.5 rounded-l-lg">S.no</th>
              {["Date", "Time", "Commented by", "Comment", "Attachment"].map(
                (heading) => (
                  <th key={heading} className="p-5">
                    <h1 className="flex items-center justify-center gap-1">
                      {heading} <HiArrowsUpDown className="dark:text-white" />
                    </h1>
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
            {taskData?.comments && taskData.comments.length > 0 ? (
              taskData.comments.map((comment, index) => (
                <tr
                  key={comment._id || index}
                  className="border-b-2 text-sm dark:border-overall_bg-dark border-overall_bg-light text-center"
                >
                  <td className="rounded-l-lg">
                    <p>{index + 1}</p>
                  </td>
                  <td>
                    <p className="py-3">{formatDate(comment.date) || "N/A"}</p>
                  </td>
                  <td>
                    <p className="py-3">{comment.time || "N/A"}</p>
                  </td>
                  <td>
                    <p className="py-3">{comment.commented_by || "N/A"}</p>
                  </td>
                  <td className="py-3">
                    <p className="max-w-xs truncate max-h-16 overflow-hidden">
                      {comment.comment || "N/A"} {/* ✅ STRING ONLY */}
                    </p>
                  </td>
                  <td className="py-3">
                    {comment.filePath ? (
                      <div className="flex items-center justify-center gap-2">
                        {/* 👁️ VIEW in Modal */}
                        <button
                          onClick={() => {
                            setPreviewFile(comment);
                            setPreviewModal(true);
                          }}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-all hover:scale-110 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          title={`View ${comment.fileName || "file"}`}
                          aria-label="View file"
                        >
                          <Eye size={16} />
                        </button>

                        {/* ⬇️ DOWNLOAD Direct */}
                        <a
                          href={comment.filePath}
                          download={
                            comment.fileName || `comment-${comment._id}`
                          }
                          className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-all hover:scale-110 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                          title={`Download ${comment.fileName || "file"}`}
                          aria-label="Download file"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No Comments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {comments && (
        <AddCommentsWithFile
          onClose={() => setComments(false)}
          task={taskData}
          loggedInUser={loggedInUserId}
          users={users}
          onSuccess={handleAddComment}
          loading={loading}
        />
      )}
      {previewModal && previewFile && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-90 flex items-center justify-center z-[1000] p-4">
          <div className="relative max-w-5xl max-h-[95vh] w-full mx-2">
            {/* Header Controls */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {/* Download from Modal */}
              <a
                href={previewFile.filePath}
                download={previewFile.fileName}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all"
              >
                <Download size={18} />
                Download
              </a>

              {/* Close */}
              <button
                onClick={() => {
                  setPreviewModal(false);
                  setPreviewFile(null);
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all"
              >
                Close
              </button>
            </div>

            {/* File Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-lg backdrop-blur-sm flex items-center justify-between">
              <span className="truncate font-medium max-w-xs">
                {previewFile.fileName || "attachment"}
              </span>
              {previewFile.fileSize && (
                <span className="text-sm opacity-75">
                  {(previewFile.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
              )}
            </div>

            {/* Preview Area */}
            <div className="w-full h-[80vh] flex items-center justify-center bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-4 border-black/20">
              {(() => {
                const url = previewFile.filePath;
                const ext = url.split(".").pop()?.toLowerCase();

                // Images
                if (
                  ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(
                    ext,
                  )
                ) {
                  return (
                    <img
                      src={url}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain rounded-lg "
                    />
                  );
                }

                // PDFs
                if (ext === "pdf") {
                  return (
                    <iframe
                      src={url}
                      className="w-full h-full rounded-lg"
                      title="PDF Preview"
                    />
                  );
                }

                // Documents & Others
                return (
                  <div className="flex flex-col items-center justify-center text-white gap-4 p-12 text-center">
                    <File size={64} className="opacity-75" />
                    <div>
                      <p className="font-semibold text-lg">
                        {previewFile.fileName}
                      </p>
                      <p className="text-sm opacity-75 mt-1">
                        Preview not supported for this file type
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddCommentsWithFile = ({
  onClose,
  task,
  loggedInUser,
  users,
  onSuccess,
  loading,
}) => {
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const userName =
    users.find(
      (u) => u.employee_id === (loggedInUser?.employee_id || loggedInUser?._id),
    )?.name || "You";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    onSuccess({ comment, file });
    setComment("");
    setFile(null);
    setPreview(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-layout-dark p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Add Comment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            disabled={loading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Comment *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-layout-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter your comment..."
              disabled={loading}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Attachment
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-layout-dark dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-white"
              disabled={loading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {preview && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                {file?.type.startsWith("image/") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-32 object-contain rounded"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded">
                    <File size={20} />
                    <span className="text-sm truncate max-w-[200px]">
                      {file?.name}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="flex-1 bg-select_layout-light dark:bg-select_layout-dark text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                "Add Comment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewTasks;
