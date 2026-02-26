import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../Constant";

const schema = yup.object().shape({
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
  commented_by: yup.string(),
  comment: yup.string().required("Comment cannot be empty"),
});

const AddComments = ({ onclose, task, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const user = JSON.parse(localStorage.getItem("employee")); // logged-in user
  const loginperson = user?.name || "";

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // HH:MM

    setValue("date", formattedDate);
    setValue("time", formattedTime);
    setValue("commented_by", loginperson);
  }, [loginperson, setValue]);

  const onSubmit = async (data) => {
    try {
      const commentData = {
        date: data.date,
        time: data.time,
        commented_by: data.commented_by,
        comment: data.comment,
      };

      await axios.post(`${API}/task/addcomment/${task._id}`, commentData);

      toast.success("Comment added successfully");
      reset();
      onclose();
    onSuccess && onSuccess(commentData);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  return (
    <div className="fixed inset-0 z-20 grid justify-center items-center backdrop-blur-xs dark:text-white text-black">
      <div className="mx-2 p-4 shadow-lg dark:bg-popup-gray bg-layout-light dark:bg-layout-dark rounded-lg drop-shadow-2xl lg:w-[500px] md:w-[500px] w-96 relative">
        <button
          onClick={onclose}
          className="absolute -top-5 -right-4 rounded-full bg-white dark:bg-layout-dark p-2 shadow-md"
        >
          <IoClose className="w-6 h-6" />
        </button>

        <h1 className="text-center font-semibold text-xl py-2 mb-4 dark:text-white text-black">
          Add Comment
        </h1>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 text-sm gap-4 px-4 py-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Date */}
          <div className="col-span-2 flex justify-between items-center">
            <label className="font-medium mb-1">Date</label>
            <input
              type="date"
              {...register("date")}
              className="w-full sm:w-64 p-2 rounded-md border border-gray-600 bg-transparent outline-none"
            />
          </div>
          {errors.date && (
            <p className="text-red-500 text-xs col-span-2">{errors.date.message}</p>
          )}

          {/* Time */}
          <div className="col-span-2 flex justify-between items-center">
            <label className="font-medium mb-1">Time</label>
            <input
              type="text"
              {...register("time")}
              className="w-full sm:w-64 p-2 rounded-md border border-gray-600 bg-transparent outline-none"
            />
          </div>
          {errors.time && (
            <p className="text-red-500 text-xs col-span-2">{errors.time.message}</p>
          )}

          {/* Commented By */}
          <div className="col-span-2 flex justify-between items-center">
            <label className="font-medium mb-1">Commented By</label>
            <input
              type="text"
              {...register("commented_by")}
              className="w-full sm:w-64 p-2 rounded-md border border-gray-600 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none"
              readOnly
            />
          </div>

          {/* Comment */}
          <div className="col-span-2 flex flex-col">
            <label className="font-medium mb-1">Comment</label>
            <textarea
              {...register("comment")}
              placeholder="Enter description..."
              rows={4}
              className="w-full p-3 rounded-md border border-gray-600 bg-transparent text-black dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.comment && (
              <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onclose}
              className="px-6 py-1.5 border border-select_layout-dark text-select_layout-dark rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-1.5 bg-select_layout-dark text-white rounded-sm dark:text-black"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComments;
