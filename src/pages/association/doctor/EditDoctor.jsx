import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { API } from "../../../Constant";
import { toast } from "react-toastify";



const schema = yup.object({
  doctor_name: yup.string().required("Doctor name is required"),
  city: yup.string().required("City is required"),
  experience: yup
    .number()
    .typeError("Experience must be a number")
    .min(0, "Experience cannot be negative")
    .required("Experience is required"),
  specialization: yup.string().required("Specialization is required"),
  contact: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Contact is required"),
  pending_payment: yup
    .number()
    .typeError("Pending payment must be a number")
    .min(0, "Pending payment cannot be negative")
    .nullable()
    .default(0),
  status: yup.string().required("Status is required"),
});

const EditDoctor = ({ onclose, doctors, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const id = doctors?._id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      doctor_name: "",
      city: "",
      experience: "",
      specialization: "",
      contact: "",
      pending_payment: 0,
      status: "",
    },
  });

  // When a new doctor prop arrives, reset the form with values
  useEffect(() => {
    if (!doctors) return;
    // normalize values (avoid undefined)
    const values = {
      doctor_name: doctors.doctor_name || "",
      city: doctors.city || "",
      experience:
        doctors.experience !== undefined && doctors.experience !== null
          ? doctors.experience
          : "",
      specialization: doctors.specialization || "",
      contact: doctors.contact || "",
      pending_payment:
        doctors.pending_payment !== undefined &&
        doctors.pending_payment !== null
          ? doctors.pending_payment
          : 0,
      status: doctors.status || "",
    };
    reset(values);
  }, [doctors, reset]);

  const onSubmit = async (formData) => {
    if (!id) {
      toast.error("Invalid doctor selected");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API}/doctor/updatedoctor/${id}`, formData);
      toast.success("Doctor updated successfully");
      onSuccess();
      onclose();
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.response?.data?.message || "Failed to update doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-layout-dark rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <button
          onClick={onclose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300"
        >
          <IoClose className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-4">
          Edit Doctor
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <FormRow label="Doctor Name" error={errors.doctor_name}>
            <input
              type="text"
              {...register("doctor_name")}
              className="w-full px-3 py-2 border rounded-lg bg-transparent  border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
            />
          </FormRow>

          <FormRow label="City" error={errors.city}>
            <input
              type="text"
              {...register("city")}
              className="w-full px-3 py-2 border rounded-lg bg-transparent  border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
            />
          </FormRow>

          <div className="grid grid-cols-2 gap-3">
            <FormRow label="Experience (years)" error={errors.experience}>
              <input
                type="number"
                {...register("experience")}
                className="w-full px-3 py-2 border rounded-lg bg-transparent  border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
              />
            </FormRow>

            <FormRow label="Pending Payment" error={errors.pending_payment}>
              <input
                type="number"
                {...register("pending_payment")}
                className="w-full px-3 py-2 border rounded-lg bg-transparent  border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
              />
            </FormRow>
          </div>

          <FormRow label="Specialization" error={errors.specialization}>
            <input
              type="text"
              {...register("specialization")}
              className="w-full px-3 py-2 border rounded-lg bg-transparent  border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
            />
          </FormRow>

          <FormRow label="Contact" error={errors.contact}>
            <input
              type="text"
              {...register("contact")}
              className="w-full px-3 py-2 border rounded-lg bg-transparent  border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
            />
          </FormRow>

          <FormRow label="Status" error={errors.status}>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border rounded-lg bg-layout-dark  border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </FormRow>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onclose}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-md text-white ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* small presentational component for label + error messaging */
const FormRow = ({ label, children, error }) => (
  <div>
    <label className=" text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 flex justify-between">
      <span>{label}</span>
      {error && <span className="text-xs text-rose-600">{error.message}</span>}
    </label>
    {children}
  </div>
);

export default EditDoctor;
