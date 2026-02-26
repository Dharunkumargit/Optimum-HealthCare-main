import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { API } from "../../../Constant";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  leaveType: yup.string().required("Leave Type is required"),
  fromDate: yup.date().required("From Date is required"),
  toDate: yup
    .date()
    .min(yup.ref("fromDate"), "To Date cannot be before From Date")
    .required("To Date is required"),
  reason: yup.string().required("Reason is required"),
});

const Apply_Leave = ({ onclose, employeeId, reportingPerson }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        employee_id: employeeId,
        reportingPerson,
        fromDate: data.fromDate,
        toDate: data.toDate,
        leaveType:data.leaveType
      };

      const res = await axios.post(`${API}/leave/apply`, payload);
      console.log(res);
      
      toast.success("Leave applied successfully");
      onclose();
    } catch (error) {
      toast.error("Cannot apply for past dates");
      console.error("Error applying leave:", error.response?.data || error.message);
    }
  };

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <div className="fixed inset-0 grid z-20 justify-center items-center backdrop-blur-xs font-layout-font">
      <div className="relative mx-2 p-4 shadow-lg dark:bg-popup-gray bg-layout-light dark:bg-layout-dark rounded-lg w-96 lg:w-[500px]">
        <button
          onClick={onclose}
          className="absolute -top-5 -right-4 rounded-full bg-white dark:bg-layout-dark p-2 shadow-md"
        >
          <IoClose size={24} />
        </button>

        <h1 className="text-center font-semibold text-xl py-2 mb-4 dark:text-white text-black">
          Apply Leave
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <label>Leave Type</label>
            <select
              {...register("leaveType")}
              className="p-2  rounded-md border border-gray-600 bg-layout-dark dark:text-white"
            >
              <option value="">Select</option>
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Paid">Paid Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
              <option value="Maternity">Maternity Leave</option>
              <option value="Paternity">Paternity Leave</option>
            </select>
            <span className="text-red-500 text-sm">
              {errors.leaveType?.message}
            </span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <label>From Date</label>
            <input
              type="date"
              {...register("fromDate")}
              min={today}
              className="p-2 rounded-md border border-gray-600 bg-transparent dark:text-white"
            />
            <span className="text-red-500 text-sm">{errors.fromDate?.message}</span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <label>To Date</label>
            <input
              type="date"
              {...register("toDate")}
              min={today}
              className="p-2 rounded-md border border-gray-600 bg-transparent dark:text-white"
            />
            <span className="text-red-500 text-sm">{errors.toDate?.message}</span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <label>Reason</label>
            <input
              type="text"
              placeholder="Enter reason"
              {...register("reason")}
              className="p-2 rounded-md border border-gray-600 bg-transparent dark:text-white"
            />
            <span className="text-red-500 text-sm">{errors.reason?.message}</span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <label>Half Day?</label>
            <input
              type="checkbox"
              {...register("halfDay")}
              className="w-5 h-5"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onclose}
              className="px-6 py-1.5 border border-select_layout-dark text-select_layout-dark rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-1.5 bg-select_layout-dark text-white dark:text-black rounded-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Apply_Leave;
