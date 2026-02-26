import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlinePlus } from "react-icons/hi";
import { API } from "../../../../Constant";

const Role = () => {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [departmentId, setDepartmentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [roleName, setRoleName] = useState("");

  /* ---------------- FETCH DEPARTMENTS ---------------- */
  const fetchDepartments = async () => {
    const res = await axios.get(`${API}/department/department`);
    setDepartments(res.data.data || []);
  };

  /* ---------------- FETCH CATEGORIES BY DEPARTMENT ---------------- */
  const fetchCategories = async (deptId) => {
    if (!deptId) {
      setCategories([]);
      return;
    }

    const res = await axios.get(
      `${API}/category/getcategoriesbydepartment?departmentId=${deptId}`
    );

    setCategories(res.data.data || []);
  };

  /* ---------------- FETCH ROLES ---------------- */
  const fetchRoles = async () => {
    const res = await axios.get(`${API}/rolemaster/getallroles`);
    setRoles(res.data.data || []);
  };

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleDepartmentChange = (e) => {
    const id = e.target.value;
    setDepartmentId(id);
    setCategoryId("");
    fetchCategories(id);
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };



  /* ---------------- SAVE ROLE ---------------- */
  const handleSave = async () => {
    if (!departmentId || !categoryId || !roleName.trim()) return;

    await axios.post(`${API}/rolemaster/create`, {
      department_id: departmentId,
      category_id: categoryId,
      role_name: roleName.toLowerCase(),
    });

    setRoleName("");
    setCategoryId("");
    setDepartmentId("");
    setShowModal(false);
    fetchRoles(); // refresh roles so dropdown updates
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="font-semibold text-lg dark:text-white">Roles</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-select_layout-dark text-white px-4 py-2 rounded-sm text-sm"
        >
          <HiOutlinePlus /> Add Role
        </button>
      </div>

      {/* TABLE */}
      <div className="dark:bg-layout-dark bg-layout-light rounded-md p-4 dark:text-white">
        {roles.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">S.No</th>
                <th className="p-2 text-left">Role Name</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr key={role._id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{role.role_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">No roles found</p>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 dark:text-white">
          <div className="bg-white dark:bg-layout-dark p-6 rounded-md w-96">
            <h3 className="font-semibold mb-4">Add Role</h3>

            {/* Department */}
            <select
              value={departmentId}
              onChange={handleDepartmentChange}
              className="w-full dark:bg-layout-dark px-3 py-2 border rounded-md mb-3"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.department_name}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              value={categoryId}
              onChange={handleCategoryChange}
              className="w-full dark:bg-layout-dark px-3 py-2 border rounded-md mb-3"
              disabled={!departmentId}
            >
              <option value="">Select Category</option>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>

            {/* Role Name */}
            <input
              type="text"
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleSave}
                className="bg-select_layout-dark text-white px-4 py-2 rounded-sm"
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

export default Role;
