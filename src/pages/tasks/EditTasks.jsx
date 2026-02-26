import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import MultiSelect from "../../component/MultiSelect";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { API, formatDate1 } from "../../Constant";

const schema = yup.object().shape({
  task_title: yup.string().required("Title is required"),
  start_date: yup.date().required("Start date is required"),
  due_date: yup.date().required("Due date is required"),
  assigned_to: yup.array().min(1, "Assign at least one member"),
  note: yup.string().nullable(),
  attachments: yup
    .mixed()
    .test("fileSize", "File size too large (max 5MB)", (files) => {
      if (!files || files.length === 0) return true;
      return Array.from(files).every((file) => file.size <= 5 * 1024 * 1024);
    })
    .test("fileType", "Only images or PDFs allowed", (files) => {
      if (!files || files.length === 0) return true;
      return Array.from(files).every((file) =>
        ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
      );
    }),
});

const EditTasks = ({ onclose, task }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      task_title: task?.task_title || "",
      start_date: formatDate1(task?.start_date),
      due_date: formatDate1(task?.due_date),
      assigned_to: Array.isArray(task?.assigned_to)
        ? task.assigned_to.map((u) => ({ value: u, label: u }))
        : [],
        attachments:[],
      note: task?.note || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/employee/getallemployees`)
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error("Error fetching roles", err));
  }, []);

  const availableUsers = users.filter((u) => u.role_id && u.role_name);
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Convert attachments to FormData for file upload
      const formData = new FormData();
      formData.append("task_title", data.task_title);
      formData.append("start_date", data.start_date);
      formData.append("due_date", data.due_date);
      formData.append("note", data.note || "");

      // // Assigned users array
      data.assigned_to.forEach((user, idx) =>
        formData.append(`assigned_to[${idx}]`, user.value)
      );

      // Attachments (if any)
      if (data.attachments?.length > 0) {
        Array.from(data.attachments).forEach((file) =>
          formData.append("attachments", file)
        );
      }

      // 🟢 PUT request to API (replace URL with yours)
      await axios.put(`${API}/task/updatetasks/${task._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Task updated successfully!");
      onclose(); // close modal
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update task. Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-layout-font fixed inset-0 grid z-20 justify-center items-center backdrop-blur-xs">
      <div className="mx-2 p-4 shadow-lg dark:bg-popup-gray bg-layout-light dark:bg-layout-dark rounded-lg drop-shadow-2xl lg:w-[500px] md:w-[500px] w-96 relative">
        <div className="grid p-4 text-layout_text-light dark:text-layout_text-dark">
          {/* Close Button */}
          <button
            onClick={onclose}
            className="place-self-end dark:bg-popup-gray bg-white dark:bg-layout-dark absolute rounded-full -top-5 -right-4 lg:shadow-md md:shadow-md shadow-none lg:py-3 md:py-3 py-0 lg:px-3 md:px-3 px-0"
          >
            <IoClose className="size-[24px]" />
          </button>

          <h1 className="text-center font-semibold text-xl py-2 mb-4 dark:text-white text-black">
            Edit Tasks
          </h1>

          {/* FORM */}
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Title */}
            <div className="col-span-2 flex justify-between items-center">
              <label className="font-medium">Title</label>
              <input
                {...register("task_title")}
                type="text"
                className="w-64 outline-none p-2 rounded-md bg-transparent border border-gray-600"
              />
            </div>
            {errors.task_title && (
              <p className="text-red-500 text-xs col-span-2">
                {errors.task_title.message}
              </p>
            )}

            {/* Start Date */}
            <div className="col-span-2 flex justify-between items-center">
              <label className="font-medium">Start Date</label>
              <input
                {...register("start_date")}
                type="date"
                className="w-64 outline-none p-2 rounded-md bg-transparent border border-gray-600"
              />
            </div>
            {errors.start_date && (
              <p className="text-red-500 text-xs col-span-2">
                {errors.start_date.message}
              </p>
            )}

            {/* Due Date */}
            <div className="col-span-2 flex justify-between items-center">
              <label className="font-medium">Due Date</label>
              <input
                {...register("due_date")}
                type="date"
                className="w-64 outline-none p-2 rounded-md bg-transparent border border-gray-600"
              />
            </div>
            {errors.due_date && (
              <p className="text-red-500 text-xs col-span-2">
                {errors.due_date.message}
              </p>
            )}

            {/* Assigned To */}
            <div className="col-span-2 flex justify-between items-center">
              <label className="font-medium">Assigned To</label>
              <MultiSelect
                options={availableUsers.map((user) => ({
                  value: user.name,
                  label: user.name,
                }))}
                value={
                  Array.isArray(watch("assigned_to"))
                    ? watch("assigned_to")
                    : []
                }
                onChange={(value) => setValue("assigned_to", value)}
                placeholder="Select team members..."
              />
            </div>
            {errors.assigned_to && (
              <p className="text-red-500 text-xs col-span-2">
                {errors.assigned_to.message}
              </p>
            )}

            {/* Attachments */}
            <div className="col-span-2 flex justify-between items-center">
              <label className="font-medium">Attachments</label>
              <input
                type="file"
                multiple
                {...register("attachments")}
                className="w-64 text-sm border border-gray-600 rounded-md file:mr-3 file:py-1.5 file:px-1 
                 file:rounded-md file:border-0 file:text-sm file:font-medium 
                 file:bg-gray-400 file:text-white hover:file:bg-gray-600
                 text-black dark:text-white"
              />
            </div>

            {/* Notes */}
            <div className="col-span-2 flex flex-col">
              <label className="font-medium mb-1">Notes</label>
              <textarea
                {...register("note")}
                className="w-full p-2 outline-none rounded-md bg-transparent border border-gray-600 text-black dark:text-white"
                placeholder="Enter description..."
                rows={4}
              />
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={onclose}
                className="border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-select_layout-dark dark:text-black text-white px-6 py-1.5 rounded-sm disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTasks;
