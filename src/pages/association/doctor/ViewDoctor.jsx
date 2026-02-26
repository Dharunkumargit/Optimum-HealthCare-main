import axios from "axios";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { API } from "../../../Constant";

const ViewDoctor = ({ onclose, doctors }) => {
  const [doctor, setDoctor] = useState(null);
  const id = doctors?._id;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${API}/doctor/getdoctor/${id}`);
        setDoctor(res.data.data);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
      }
    };
    if (id) fetchDoctor();
  }, [id]);

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md md:max-w-md lg:max-w-md bg-white dark:bg-layout-dark rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onclose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          <IoClose className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-4">
          Doctor Details
        </h2>

        {/* Details Section */}
        <div className="grid  gap-4 text-gray-700 dark:text-gray-200">
          <Detail label="Name" value={doctor.doctor_name} />
          <Detail label="City" value={doctor.city} />
          <Detail label="Experience" value={`${doctor.experience} years`} />
          <Detail label="Specialization" value={doctor.specialization} />
          <Detail label="Contact" value={doctor.contact} />
          <Detail
            label="Pending Payment"
            value={
              doctor.pending_payment > 0
                ? `₹${doctor.pending_payment.toLocaleString()}`
                : "No Pending"
            }
          />
          <Detail label="Status" value={doctor.status || "N/A"} />
        </div>
      </div>
    </div>
  );
};

// ✅ Small reusable component for clean layout
const Detail = ({ label, value }) => (
  <div className="flex justify-between pb-2">
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {label}
    </span>
    <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
      {value || "-"}
    </span>
  </div>
);

export default ViewDoctor;
