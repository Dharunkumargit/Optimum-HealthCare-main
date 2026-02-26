import React from "react";
import { IoClose } from "react-icons/io5";

const ViewHospital = ({ hospital, onclose }) => {
  if (!hospital) return null;

  const Input = ({ label, value }) => (
    <div className="grid gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        value={value || ""}
        disabled
        className="border p-2 border-gray-400 rounded-md w-full  text-gray-700 dark:text-white"
      />
    </div>
  );

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
          View Hospital
        </h2>
        <div className="grid gap-4">
          <Input label="Hospital Name" value={hospital.hospital_name} />
          <Input label="City" value={hospital.city} />
          <Input label="Address" value={hospital.address} />
          <Input label="Specialization" value={hospital.specialization} />
          <Input label="Contact" value={hospital.contact} />
          <Input label="Overdue Amount" value={hospital.overdue || "No Due"} />
          <Input label="Status" value={hospital.status} />
        </div>
      </div>
    </div>
  );
};

export default ViewHospital;
