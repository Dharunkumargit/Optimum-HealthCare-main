import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";

// ✅ Doctor validation schema
const schema = yup.object().shape({
  doctor_name: yup.string().required("Doctor name is required"),
  city: yup.string().required("City is required"),
  experience: yup
    .number()
    .typeError("Experience must be a number")
    .min(0, "Invalid experience")
    .required("Experience is required"),
  specialization: yup.string().required("Specialization is required"),
  contact: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit contact number")
    .required("Contact is required"),
  pending_payment: yup
    .number()
    .typeError("Pending payment must be a number")
    .min(0, "Invalid amount")
    .required("Pending payment is required"),
  status: yup.string().required("Status is required"),
});

const AddDoctor = ({ onclose }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${API}/doctor/add`, data);
      toast.success("Doctor added successfully");
      onclose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 grid place-items-center backdrop-blur-sm">
      <div className="relative  p-6 rounded-lg bg-layout-light dark:bg-layout-dark text-black dark:text-white shadow-lg">
        <button
          onClick={onclose}
          className="absolute -top-4 -right-4 p-2 rounded-full shadow-md bg-white dark:bg-layout-dark"
        >
          <IoClose size={22} />
        </button>

        <h1 className="text-center text-xl font-semibold mb-4">Add Doctor</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-6 gap-6"
        >
          {/* Doctor Name */}
          <div className="col-span-6 sm:col-span-3">
            <label className="font-medium">Doctor Name</label>
            <input
              type="text"
              placeholder="Doctor Name"
              {...register("doctor_name")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.doctor_name && (
              <p className="text-xs text-red-500">
                {errors.doctor_name.message}
              </p>
            )}
          </div>

          {/* City */}
          <div className="col-span-6 sm:col-span-3">
            <label className="font-medium">City</label>
            <input
              type="text"
              placeholder="City"
              {...register("city")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* Experience */}
          <div className="col-span-6 sm:col-span-3">
            <label className="font-medium">Experience (Years)</label>
            <input
              type="number"
              placeholder="Experience"
              {...register("experience")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.experience && (
              <p className="text-xs text-red-500">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Specialization */}
          <div className="col-span-6 sm:col-span-3">
            <label className="font-medium">Specialization</label>
            <input
              type="text"
              placeholder="Specialization"
              {...register("specialization")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.specialization && (
              <p className="text-xs text-red-500">
                {errors.specialization.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="col-span-6 sm:col-span-3">
            <label className="font-medium">Contact</label>
            <input
              type="text"
              placeholder="Contact"
              {...register("contact")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.contact && (
              <p className="text-xs text-red-500">{errors.contact.message}</p>
            )}
          </div>

          {/* Pending Payment */}
          <div className="col-span-6 sm:col-span-3">
            <label className="font-medium">Pending Payment</label>
            <input
              type="number"
              placeholder="Pending Payment"
              {...register("pending_payment")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.pending_payment && (
              <p className="text-xs text-red-500">
                {errors.pending_payment.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="col-span-6 sm:col-span-3">
            <label className="font-medium">Status</label>
            <select
              {...register("status")}
              className="p-2 w-full border rounded-md bg-layout-dark border-gray-600"
            >
              <option value="">Select</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-6 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onclose}
              className="border px-6 py-1.5 rounded-sm border-gray-600 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-1.5 rounded-sm ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-select_layout-dark text-white"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
