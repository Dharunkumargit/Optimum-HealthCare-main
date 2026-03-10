import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlinePlus } from "react-icons/hi";
import { API } from "../../../../Constant";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";

const Category = () => {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API}/department/department`);
      setDepartments(res.data?.data || []);
    } catch (err) {
      console.error("Department fetch error", err);
    }
  };

  // 🔹 Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/category/getallcategories`);
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Category fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchCategories();
  }, []);

  // 🔹 Add Category
  const handleSave = async () => {
    if (!departmentId || !categoryName.trim()) return;

    try {
      await axios.post(`${API}/category/addcategory`, {
        category_name: categoryName.toLowerCase(),
        department_id: departmentId,
        department_name: departments.find((dept) => dept._id === departmentId)
          ?.department_name,
      });

      setCategoryName("");
      setDepartmentId("");
      setShowModal(false);
      fetchCategories();
      toast.success("Category added successfully");
    } catch (err) {
      console.error("Add category error", err);
      toast.error("Failed to add category");
    }
  };

  // 🔹 Delete Category
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/category/deletecategory/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("Delete category error", err);
      toast.error("Failed to delete category");
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
          Categories
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-select_layout-dark text-white px-4 py-2 rounded-sm text-sm hover:opacity-90 transition"
        >
          <HiOutlinePlus /> Add Category
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-layout-light dark:bg-layout-dark rounded-md p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : categories.length > 0 ? (
          <table className="w-full text-sm text-gray-800 dark:text-white">
            <thead>
              <tr className="border-b border-gray-300 dark:border-white">
                <th className="p-2 text-left">S.No</th>
                <th className="p-2 text-left">Department</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr
                  key={cat._id}
                  className="border-b border-gray-200 dark:border-white dark:hover:bg-layout-darkSecondary transition"
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 capitalize">{cat.department_name}</td>
                  <td className="p-2 capitalize">{cat.category_name}</td>

                  {/* DELETE COLUMN */}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDelete(cat._id)}
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
            No categories found
          </p>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 dark:text-white">
          {" "}
          <div className="bg-white dark:bg-layout-dark p-6 rounded-md w-96">
            {" "}
            <h3 className="font-semibold mb-4">Add Category</h3>{" "}
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full bg-layout-dark dark:text-white px-3 py-2 border rounded-md mb-3"
            >
              {" "}
              <option value="">Select Department</option>{" "}
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {" "}
                  {dept.department_name}{" "}
                </option>
              ))}{" "}
            </select>{" "}
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />{" "}
            <div className="flex justify-end gap-3">
              {" "}
              <button onClick={() => setShowModal(false)}>Cancel</button>{" "}
              <button
                onClick={handleSave}
                className="bg-select_layout-dark text-white px-4 py-2 rounded-sm"
              >
                {" "}
                Save{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}
    </>
  );
};

export default Category;
