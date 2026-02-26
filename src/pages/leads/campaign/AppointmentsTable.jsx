import React, { useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import { HiArrowsUpDown } from "react-icons/hi2";
import { FiTrash2 } from "react-icons/fi";
import DeleteModal from "../../../component/DeleteModal";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";

const AppointmentsTable = ({data}) => {
  const [appointments, setAppointments] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // // ✅ Fetch appointments from API
  // const fetchAppointments = async () => {
  //   try {
  //     const res = await axios.get(`${API}/appointments`);
  //     setAppointments(res.data || []);
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to fetch appointments");
  //   }
  // };

  // useEffect(() => {
  //   fetchAppointments();
  // }, []);
  useEffect(() => {
    setAppointments(data || []);
  }, [data]);
  // ✅ Delete appointment
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/appointment/${id}`);
      setAppointments(appointments.filter((a) => a._id !== id));
      setDeleteModal(false);
      toast.success("Appointment deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    }
  };

  return (
    <div className="">
      {appointments.length > 0 ? (
        <div className="font-layout-font overflow-auto no-scrollbar h-48">
          <table className="w-full dark:text-white whitespace-nowrap">
            <thead>
              <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
                <th className="py-4 px-2 rounded-l-lg">S.no</th>
                {[
                  "Patient Name",
                  "Contact Number",
                  "Email",
                  "Appointment Date",
                  "Consultant",
                  "Treatment type",
                  "Notes",
                ].map((heading) => (
                  <th key={heading} className="p-2">
                    <h1 className="flex items-center justify-center gap-1">
                      {heading} <HiArrowsUpDown className="dark:text-white" />
                    </h1>
                  </th>
                ))}
                <th className="pr-2 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
              {appointments.map((data, index) => (
                <tr
                  key={data._id}
                  className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                >
                  <td className="rounded-l-lg">{index + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.phone}</td>
                  <td>{data.email}</td>
                  <td>{new Date(data.date).toLocaleDateString()}</td>
                  <td>{data.doctor_name}</td>
                  <td>{data.treatmentype}</td>
                  <td>{data.notes}</td>
                  <td className="p-3 rounded-r-lg">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => toast.info(JSON.stringify(data, null, 2))}
                        className="cursor-pointer p-0.5 rounded-sm bg-green-200 text-green-600"
                      >
                        <LuEye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAppointment(data);
                          setDeleteModal(true);
                        }}
                        className="cursor-pointer p-0.5 rounded-sm bg-red-200 text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dark:bg-layout-dark bg-layout-light text-red-500 text-center py-4 font-semibold text-lg -mt-2 rounded-lg">
          <p>No Data Available !!!</p>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && selectedAppointment && (
        <DeleteModal
          onclose={() => setDeleteModal(false)}
          title="Appointment"
          onConfirm={() => handleDelete(selectedAppointment._id)}
        />
      )}
    </div>
  );
};

export default AppointmentsTable;
