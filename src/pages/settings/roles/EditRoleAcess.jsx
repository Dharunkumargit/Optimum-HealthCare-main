import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../../../component/Title";
import { API } from "../../../Constant";

const EditRoleAccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roleId } = location.state || {};

  const [createdBy, setCreatedBy] = useState("System");

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // For API
  const [selectedRoleName, setSelectedRoleName] = useState(""); // For display

  const [selectedSettings, setSelectedSettings] = useState({});
  const [permissions, setPermissions] = useState({});

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

  // Fetch all departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API}/department/department`);
        setDepartments(res.data.data || []);
      } catch (error) {
        console.error(error);
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
        setCategories(res.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, [selectedDepartment]);

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchRoles = async () => {
      try {
        const res = await axios.get(
          `${API}/rolemaster/by-category/${selectedCategory}`
        );

        const rolesData = res.data.data || [];
        setRoles(rolesData);

        // ✅ preselect role AFTER roles load
        if (selectedRole) {
          const matchedRole = rolesData.find((r) => r._id === selectedRole);
          if (matchedRole) {
            setSelectedRoleName(matchedRole.role_name);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoles();
  }, [selectedCategory, selectedRole]);

  useEffect(() => {
    if (!roleId) return;

    const fetchExistingRole = async () => {
      try {
        const res = await axios.get(`${API}/role/byid?roleId=${roleId}`);
        const data = res.data.data;

        setCreatedBy(data.created_by_user || "System");
        setSelectedDepartment(data.department_id);
        setSelectedCategory(data.category_id);
        setSelectedRole(data.role_id || "");
        setSelectedRoleName(data.role_name || "");

        const perms = {};
        const selected = {};
        (data.accessLevels || []).forEach((item) => {
          selected[item.feature] = true;
          perms[item.feature] = item.permissions;
        });

        setSelectedSettings(selected);
        setPermissions(perms);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExistingRole();
  }, [roleId]);

  const toggleSetting = (setting) => {
    setSelectedSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));

    setPermissions((prev) => {
      if (prev[setting]) {
        const updated = { ...prev };
        delete updated[setting];
        return updated;
      }
      return { ...prev, [setting]: [] };
    });
  };

  const handlePermissionChange = (setting, permission, checked) => {
    setPermissions((prev) => {
      let updatedPermissions = prev[setting] || [];

      if (permission === "All") {
        updatedPermissions = checked ? permissionOptions.slice(1) : [];
      } else {
        updatedPermissions = checked
          ? [...updatedPermissions, permission]
          : updatedPermissions.filter((p) => p !== permission);
        if (!checked)
          updatedPermissions = updatedPermissions.filter((p) => p !== "All");
      }

      if (updatedPermissions.length === permissionOptions.length - 1) {
        updatedPermissions = ["All", ...updatedPermissions];
      }

      return { ...prev, [setting]: updatedPermissions };
    });
  };

  const handleSave = async () => {
    if (!selectedDepartment || !selectedCategory || !selectedRole) {
      toast.error("Please select department, category, and role");
      return;
    }

    const accessLevels = Object.entries(permissions).map(
      ([feature, perms]) => ({
        feature,
        permissions: perms,
      })
    );

    const payload = {
      role_id: selectedRole,
      role_name: selectedRoleName,
      department_id: selectedDepartment,
      category_id: selectedCategory,
      accessLevels,
      created_by_user: createdBy,
      status: "active",
    };
    console.log(payload);

    try {
      await axios.put(`${API}/role/update?roleId=${roleId}`, payload);
      toast.success("Role updated successfully");
      navigate("/setting");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <Title
          title="Settings"
          sub_title="Role Access"
          page_title="Edit role Access"
        />
        <div className="flex gap-3">
          <p
            onClick={() => navigate("/setting")}
            className="cursor-pointer border dark:border-white dark:text-white border-darkest-blue px-8 py-2 rounded-sm"
          >
            Cancel
          </p>
          <p
            onClick={handleSave}
            className="bg-select_layout-dark dark:bg-select_layout-light text-white px-8 py-2 rounded-sm"
          >
            Save
          </p>
        </div>
      </div>

      {/* Dropdowns */}
      <div className="flex gap-6 mb-4 dark:text-white">
        <div>
          <span className="font-semibold px-1">Department</span>
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedCategory("");
              setRoles([]);
              setSelectedRole("");
            }}
            className="px-3 py-1.5 rounded-md outline-none dark:bg-layout-dark bg-white text-black dark:text-white"
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.department_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="font-semibold px-1">Category</span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setRoles([]);
              setSelectedRole("");
            }}
            className="px-3 py-1.5 rounded-md outline-none dark:bg-layout-dark bg-white text-black dark:text-white"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.category_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="font-semibold px-1">Role</span>
          <select
            value={selectedRole}
            onChange={(e) => {
              const role = roles.find((r) => r.role_id === e.target.value);
              setSelectedRole(e.target.value);
              setSelectedRoleName(role?.role_name || "");
            }}
            className="px-3 py-1.5 rounded-md outline-none dark:bg-layout-dark bg-white text-black dark:text-white"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r._id} value={r.role_id}>
                {r.role_name}
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
                          />
                        </svg>
                      )}
                    </span>
                  </label>
                  {setting}
                </label>
              </div>
            ))}
          </div>

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
                                />
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

export default EditRoleAccess;
