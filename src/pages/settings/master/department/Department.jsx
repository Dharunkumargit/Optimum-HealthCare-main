import React, { useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import axios from "axios";
import { API } from "../../../../Constant";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/department/department`);
      setDepartments(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching departments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 🔹 Add Department
  const handleSave = async () => {
    if (!departmentName.trim()) return;

    try {
      await axios.post(`${API}/department/department/add`, {
        department_name: departmentName.toLowerCase(),
      });

      setDepartmentName("");
      setShowModal(false);
      toast.success("Department added successfully");
      fetchDepartments();
    } catch (err) {
      console.error("Error adding department", err);
      toast.error("Failed to add department");
    }
  };
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this department?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API}/department/department/delete/${id}`);

    toast.success("Department deleted successfully");
    fetchDepartments();
  } catch (err) {
    console.error("Error deleting department", err);
    toast.error("Failed to delete department");
  }
};

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
          Departments
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-select_layout-dark text-white px-4 py-2 rounded-sm text-sm hover:opacity-90 transition"
        >
          <HiOutlinePlus size={18} /> Add Department
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-layout-light dark:bg-layout-dark rounded-md p-4 shadow-sm">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Loading...
          </p>
        ) : departments.length > 0 ? (
          <table className="w-full text-sm text-gray-800 dark:text-white">
            <thead>
              <tr className="border-b border-gray-300 dark:border-white">
                <th className="text-left p-2">S.No</th>
                <th className="text-left p-2">Department ID</th>
                <th className="text-left p-2">Department Name</th>
                <th className="text-center p-2">Action</th>
              </tr>
            </thead>
            <tbody>
  {departments.map((dept, index) => (
    <tr
      key={dept._id}
      className="border-b border-gray-200 dark:border-white dark:hover:bg-layout-darkSecondary transition"
    >
      <td className="p-2">{index + 1}</td>
      <td className="p-2">{dept.department_id}</td>
      <td className="p-2 capitalize">
        {dept.department_name}
      </td>

      {/* DELETE COLUMN */}
      <td className="p-2 text-center">
        <button
          onClick={() => handleDelete(dept._id)}
          className="text-red-500 hover:text-red-700 transition"
        >
          <MdDeleteOutline size={20} />
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No departments found
          </p>
        )}
      </div>

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-layout-dark rounded-md p-6 w-96 shadow-lg">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-white">
              Add Department
            </h3>

            <input
              type="text"
              placeholder="Department Name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300  rounded-md outline-none 
               dark:bg-layout-darkSecondary 
              text-gray-800 dark:text-white 
              placeholder-gray-400 dark:placeholder-gray-500
               mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-sm text-gray-700 dark:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-select_layout-dark text-white rounded-sm hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Department;