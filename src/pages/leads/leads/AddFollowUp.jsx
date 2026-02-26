import React from "react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import axios from "axios";

import { toast } from "react-toastify";
import { API } from "../../../Constant";

const AddFollowUp = ({ onclose, selectedLead,onsuccess}) => {
    const  logindetails = JSON.parse(localStorage.getItem("employee"));
    const user = logindetails?.name;


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      follow_up_date: "",
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API}/lead/followup/add`, {
        lead_id: selectedLead.lead_id,
        follow_up_date: data.follow_up_date,
        notes: data.notes,
        createdBy: user|| "Admin",
      });
      onsuccess();
      toast.success("Follow-up added successfully");
      onclose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 rounded-lg shadow-lg dark:bg-layout-dark bg-layout-light">

        {/* Close Button */}
        <button
          onClick={onclose}
          className="absolute -top-4 -right-4 bg-white dark:bg-layout-dark rounded-full p-2 shadow"
        >
          <IoClose size={22} />
        </button>

        <div className="p-6 dark:text-white text-black">
          <h1 className="text-center font-semibold text-xl mb-6">
            Add Follow-up
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Lead Name */}
            <div className="flex justify-between items-center gap-4">
              <label className="text-sm">Lead Name</label>
              <input
                type="text"
                value={selectedLead?.name || ""}
                disabled
                className="w-72 p-2 rounded-md bg-transparent border border-[#454545] opacity-70"
              />
            </div>

            {/* Follow-up Date */}
            <div className="flex justify-between items-center gap-4">
              <label className="text-sm">Follow-up Date</label>
              <div className="w-72">
                <input
                  type="date"
                  {...register("follow_up_date", {
                    required: "Follow-up date is required",
                  })}
                  className="w-full p-2 rounded-md bg-transparent border border-[#454545]"
                />
                {errors.follow_up_date && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.follow_up_date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="flex justify-between items-start gap-4">
              <label className="text-sm pt-2">Notes</label>
              <div className="w-72">
                <textarea
                  rows={4}
                  placeholder="Enter notes"
                  {...register("notes", {
                    minLength: {
                      value: 5,
                      message: "Notes must be at least 5 characters",
                    },
                  })}
                  className="w-full p-2 rounded-md bg-transparent border border-[#454545]"
                />
                {errors.notes && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.notes.message}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-6 text-sm">
              <button
                type="button"
                onClick={onclose}
                className="border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-select_layout-dark text-white px-6 py-1.5 rounded-sm disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFollowUp;
