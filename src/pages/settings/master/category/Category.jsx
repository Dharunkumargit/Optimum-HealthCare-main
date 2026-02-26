import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlinePlus } from "react-icons/hi";
import { API } from "../../../../Constant";


const Category = () => {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [departmentId, setDepartmentId] = useState("");
  const [categoryName, setCategoryName] = useState("");

  // Fetch departments
  const fetchDepartments = async () => {
    const res = await axios.get(`${API}/department/department`);

    console.log(res,"dep");
    
    setDepartments(res.data.data || []);
  };


  // Fetch categories
  const fetchCategories = async () => {
    const res = await axios.get(`${API}/category/getallcategories`);
    setCategories(res.data.data || []);
  };

  useEffect(() => {
    fetchDepartments();
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!departmentId || !categoryName.trim()) return;

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
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg dark:text-white">Categories</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-select_layout-dark text-white px-4 py-2 rounded-sm text-sm"
        >
          <HiOutlinePlus /> Add Category
        </button>
      </div>

      {/* TABLE */}
      <div className="dark:bg-layout-dark bg-layout-light rounded-md p-4 dark:text-white">
        {categories.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">S.No</th>
                <th className="p-2 text-left">Department</th>
                <th className="p-2 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id} className="border-b text-white">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{cat.department_name}</td>
                  <td className="p-2">{cat.category_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">No categories found</p>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 dark:text-white">
          <div className="bg-white dark:bg-layout-dark p-6 rounded-md w-96">
            <h3 className="font-semibold mb-4">Add Category</h3>

            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full bg-layout-dark dark:text-white px-3 py-2 border rounded-md mb-3"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option  key={dept._id} value={dept._id}>
                  {dept.department_name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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

export default Category;
