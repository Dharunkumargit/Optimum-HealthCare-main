import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { API } from "../../../Constant";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  hospital_name: yup.string().required("Hospital name is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  specialization: yup.string().required("Specialization is required"),
  contact: yup.string().required("Contact is required"),
  overdue: yup.number().min(0, "Overdue cannot be negative").nullable(),
  status: yup.string().required("Status is required"),
});

const AddHospital = ({ onclose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API}/hospital/add`, data);
      toast.success("Hospital added successfully");
      reset();
      onclose();
      onSuccess && onSuccess();
    } catch (err) {
      toast.error("Failed to add hospital");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md bg-white dark:bg-layout-dark rounded-2xl p-6 shadow-xl">
        <button
          onClick={onclose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          <IoClose className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
          Add Hospital
        </h2>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Hospital Name"
            {...register("hospital_name")}
            placeholder="enter hospital name"
            error={errors.hospital_name?.message}
          />
          <Input
            label="City"
            {...register("city")}
            placeholder="enter city"
            error={errors.city?.message}
          />
          <Input
            label="Address"
            {...register("address")}
            placeholder="enter address"
            error={errors.address?.message}
          />
          <Input
            label="Specialization"
            {...register("specialization")}
            placeholder="enter specialization"
            error={errors.specialization?.message}
          />
          <Input
            label="Contact"
            {...register("contact")}
            placeholder="enter contact"
            error={errors.contact?.message}
          />
          <Input
            label="Overdue Amount"
            placeholder="enter overdue amount"
            type="number"
            {...register("overdue")}
            error={errors.overdue?.message}
          />
          <label className="text-gray-300">status</label>
          <select
            {...register("status")}
            className="border border-gray-600 text-gray-300 rounded-md p-2 w-full"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}

          <button
            type="submit"
            className="dark:bg-select_layout-dark bg-select_layout-light text-white py-2 rounded-md mt-2"
          >
            Add Hospital
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, error, placeholder="", ...props }) => (
  <div className="grid gap-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      {...props}
      className="border p-2 rounded-md w-full  bg-transparent border-gray-600 dark:text-white"
      placeholder={placeholder}
    />
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

export default AddHospital;
