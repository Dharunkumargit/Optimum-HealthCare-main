import React, { useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import axios from "axios";
import { API } from "../../../../Constant";


const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [departmentName, setDepartmentName] = useState("");

  // 🔹 Fetch Departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API}/department/department`);
      console.log(res);
      
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching departments", err);
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
      fetchDepartments();
    } catch (err) {
      console.error("Error adding department", err);
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg dark:text-white">
          Departments
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-select_layout-dark text-white px-4 py-2 rounded-sm text-sm"
        >
          <HiOutlinePlus size={18} /> Add Department
        </button>
      </div>

      {/* TABLE */}
      <div className="dark:bg-layout-dark bg-layout-light rounded-md p-4">
        {departments.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className=" text-white">
                <th className="text-left p-2">S.No</th>
                <th className="text-left p-2">Department ID</th>
                <th className="text-left p-2">Department Name</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr
                  key={dept._id}
                  className=" text-white"
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{dept.department_id}</td>
                  <td className="p-2">{dept.department_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">No departments found</p>
        )}
      </div>

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-layout-dark rounded-md p-6 w-96">
            <h3 className="font-semibold mb-4 dark:text-white">
              Add Department
            </h3>

            <input
              type="text"
              placeholder="Department Name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none dark:bg-layout-darkSecondary dark:text-white mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-select_layout-dark text-white rounded-sm"
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
