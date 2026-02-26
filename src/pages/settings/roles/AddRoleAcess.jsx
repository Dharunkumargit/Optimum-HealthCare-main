import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../../../component/Title";
import { API } from "../../../Constant";

const AddRoles = () => {
  const [createdBy, setCreatedBy] = useState("System");
  const [selectedSettings, setSelectedSettings] = useState({});
  const [permissions, setPermissions] = useState({});

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();

  const settingsOptions = [
    "Dashboard",
    "Tasks",
    "Leads",
    "Campaigns",
    "Association",
    "Appointments",
    "Finance",
    "HR",
    "Reports",
    "Settings",
  ];

  const permissionOptions = [
    "All",
    "View",
    "Create",
    "Edit",
    "Delete",
    "Download",
  ];

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API}/department/department`);

        setDepartments(res.data.data);
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch categories when department changes
  useEffect(() => {
    if (!selectedDepartment) {
      setCategories([]);
      setSelectedCategory("");
      return;
    }
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${API}/category/getcategoriesbydepartment?departmentId=${selectedDepartment}`
        );
        console.log(res);
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, [selectedDepartment]);

  // Fetch roles when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setRoles([]);
      setSelectedRole("");
      return;
    }
    const fetchRoles = async () => {
      try {
        const res = await axios.get(
          `${API}/rolemaster/by-category/${selectedCategory}`
        );
        setRoles(res.data.data);
      } catch (error) {
        console.error("Error fetching roles", error);
      }
    };
    fetchRoles();
  }, [selectedCategory]);

  // Toggle Settings Checkbox
  const toggleSetting = (setting) => {
    setSelectedSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));

    setPermissions((prev) => {
      if (prev[setting]) {
        const updated = { ...prev };
        delete updated[setting];
        return updated;
      }
      return { ...prev, [setting]: [] };
    });
  };

  // Handle Permission Changes
  const handlePermissionChange = (setting, permission, checked) => {
    setPermissions((prev) => {
      let updatedPermissions = prev[setting] || [];

      if (permission === "All") {
        updatedPermissions = checked ? permissionOptions.slice(1) : [];
      } else {
        updatedPermissions = checked
          ? [...updatedPermissions, permission]
          : updatedPermissions.filter((p) => p !== permission);
      }

      // Auto-check "All" if all individual permissions selected
      if (
        permissionOptions.slice(1).every((p) => updatedPermissions.includes(p))
      ) {
        updatedPermissions = ["All", ...permissionOptions.slice(1)];
      } else {
        updatedPermissions = updatedPermissions.filter((p) => p !== "All");
      }

      return { ...prev, [setting]: updatedPermissions };
    });
  };

  const handleSave = async () => {
    if (!selectedDepartment || !selectedCategory || !selectedRole) {
      toast.error("Please select department, category, and role");
      return;
    }

    // 🚨 ACCESS LEVEL VALIDATION
    const hasValidAccess = Object.values(permissions).some(
      (perms) => Array.isArray(perms) && perms.length > 0
    );

    if (!hasValidAccess) {
      toast.error("Please select at least one access permission");
      return;
    }

    const accessLevels = Object.entries(permissions)
      .filter(([_, perms]) => perms.length > 0)
      .map(([feature, perms]) => ({
        feature,
        permissions: perms,
      }));

    const selectedRoleObj = roles.find((r) => r._id === selectedRole);

    const payload = {
      role_id: selectedRoleObj.role_id, // RAC-001
      role_name: selectedRoleObj.role_name, // CEO

      department_id: selectedDepartment,
      department_name:
        departments.find((d) => d._id === selectedDepartment)
          ?.department_name || "",

      category_id: selectedCategory,
      category_name:
        categories.find((c) => c._id === selectedCategory)?.category_name || "",

      accessLevels,
      created_by_user: createdBy,
      status: "ACTIVE",
    };

    try {
      await axios.post(`${API}/role/add`, payload);
      toast.success("Role created successfully");
      navigate("/setting");
    } catch (error) {
      toast.error("Error saving role");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <Title
          title="Settings"
          sub_title="Role Access"
          page_title="Add Role Access"
        />
        <div className="flex gap-3">
          <p
            onClick={() => navigate("..")}
            className="cursor-pointer border dark:border-white text-white border-darkest-blue px-8 py-2 rounded-sm"
          >
            Cancel
          </p>
          <p
            onClick={handleSave}
            className="cursor-pointer bg-select_layout-dark dark:bg-select_layout-light text-white px-8 py-2 rounded-sm"
          >
            Save
          </p>
        </div>
      </div>

      {/* Three Dropdowns */}
      <div className="flex items-center gap-6 mb-4">
        {/* Department */}
        <div>
          <span className="font-semibold px-1 dark:text-white text-black">
            Department
          </span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-1.5 rounded-md outline-none dark:bg-layout-dark bg-white text-black dark:text-white"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <span className="font-semibold px-1 dark:text-white text-black">
            Category
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-md outline-none dark:bg-layout-dark bg-white text-black dark:text-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div>
          <span className="font-semibold px-1 dark:text-white text-black">Role</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={!roles.length}
            className="px-3 py-1.5 rounded-md outline-none dark:bg-layout-dark bg-white text-black dark:text-white"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Created By */}
      <div className="flex items-center gap-10 mb-4 dark:text-white">
        <span className="font-semibold">Created By</span>
        <input
          type="text"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="px-3 py-1.5 rounded-md outline-none dark:bg-layout-dark bg-white text-black dark:text-white"
        />
      </div>

      {/* Settings & Permissions */}
      <div className="dark:bg-layout-dark dark:text-white bg-white p-10 rounded-xl">
        <div className="grid grid-cols-3 gap-2">
          {/* Settings */}
          <div className="border-r-2 p-3 h-80">
            <h2 className="text-lg font-medium mb-4 w-1/2 text-center">
              Settings
            </h2>
            {settingsOptions.map((setting) => (
              <div key={setting} className="flex items-center mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedSettings[setting]}
                      onChange={() => toggleSetting(setting)}
                      className="appearance-none w-5 h-5 border-2 dark:border-white border-darkest-blue rounded-md checked:bg-select_layout-dark checked:border-transparent focus:outline-none transition-all duration-200"
                    />
                    <span className="absolute w-5 h-5 flex justify-center items-center pointer-events-none">
                      {selectedSettings[setting] && (
                        <svg
                          className="w-10 h-4 dark:text-black text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    </span>
                  </label>
                  {setting}
                </label>
              </div>
            ))}
          </div>

          {/* Permissions */}
          <div className="p-4">
            <h2 className="text-lg font-medium mb-3">Permissions</h2>
            {settingsOptions.map((setting) => (
              <div key={setting} className="flex items-center">
                {selectedSettings[setting] ? (
                  <div className="flex items-center justify-between p-2 rounded-md">
                    <div className="flex gap-4 w-3/4">
                      {permissionOptions.map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center gap-4 cursor-pointer text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={
                              permissions[setting]?.includes(perm) || false
                            }
                            onChange={(e) =>
                              handlePermissionChange(
                                setting,
                                perm,
                                e.target.checked
                              )
                            }
                            className="appearance-none w-5 h-5 border-2 dark:border-white border-darkest-blue rounded-md checked:bg-select_layout-dark checked:border-transparent focus:outline-none transition-all duration-200"
                          />
                          <span className="absolute w-5 h-5 flex justify-center items-center pointer-events-none">
                            {permissions[setting]?.includes(perm) && (
                              <svg
                                className="w-10 h-4 dark:text-black text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            )}
                          </span>
                          {perm}
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-9"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRoles;
