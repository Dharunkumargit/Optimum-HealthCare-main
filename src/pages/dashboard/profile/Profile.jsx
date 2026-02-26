import React, { useEffect, useState } from "react";
import NavBar from "../../../component/NavBar";
import Dropdown from "../../../component/Dropdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Change_Password from "./Change_Password";
import Edit_Profile from "./Edit_Profile";
import WFH_Leave from "./wfh_leave/WFH_Leave";
import profile from "../../../assets/images/profile.jpg";
import { API } from "../../../Constant";

const Profile = () => {
  const navigate = useNavigate();
  const [editProfile, setEditProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);

  const user = JSON.parse(localStorage.getItem("employee")); // logged-in user
  const employee_id = user.employee_id;
  const role_name = user.role.role_name;

  // Fetch all employees to map reporting person name
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employee/getallemployees`);
      setAllEmployees(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  // Fetch profile data by employee ID
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/employee/getemployee/${employee_id}`);
      setProfileData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchProfile();
  }, []);

  if (!profileData)
    return <p className="text-center py-10">Loading profile...</p>;

  // Helper: get employee name from ID
  const getEmployeeName = (id) => {
    if (!id) return "—";
    const emp = allEmployees.find((e) => e.employee_id === id);
    return emp ? emp.name : id;
  };

  // Helper: format date as DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Fields to display in the profile info grid
  const profileFields = [
    { label: "Employee ID", key: "employee_id" },
    { label: "Name", key: "name" },
    { label: "Designation", key: "department" },
    { label: "Gender", key: "gender" },
    { label: "Date of Birth", key: "dob", format: formatDate },
    { label: "Mobile Number", key: "phone" },
    { label: "Email ID", key: "email" },
    { label: "Joining Date", key: "createdAt", format: formatDate },
    { label: "Language", key: "language" },
    { label: "Reporting Person", key: "rpperson", format: getEmployeeName },
    { label: "Address", key: "address" },
    {
      label: "Last Login",
      key: "lastlogin",
      format: (d) =>
        new Date(d).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // 24-hour format
        }),
    },
  ];

  // Dropdown menu items
  const dropdownItems = [
    { label: "Edit Profile", onClick: () => setEditProfile(true) },
    { label: "Change Password", onClick: () => setChangePassword(true) },
    { label: "Logout", onClick: () => navigate("/") },
  ];

  return (
    <div>
      <NavBar title="Dashboard" pagetitle="Profile" />

      <div className="lg:grid grid-cols-12 flex flex-col gap-3 py-3">
        {/* Left profile card */}
        <div className="lg:col-span-5 flex flex-col gap-3 rounded-lg text-white">
          <div className="flex justify-between lg:mb-2 dark:bg-layout-dark bg-layout-light text-black dark:text-white rounded-lg p-4">
            <div className="flex items-center gap-4">
              <img
                className="w-24 h-24 rounded-md border border-gray-500"
                src={profileData.profile_picture || profile}
                alt="Profile"
              />
              <span>
                <p className="font-bold text-xl">{profileData.name || "—"}</p>
                <p className="text-sm">
                  Designation:{" "}
                  <span className="text-gray-500">
                    {profileData.department || "—"}
                  </span>
                </p>
                <p className="text-sm">
                  Last Login:{" "}
                  <span className="text-gray-500">
                    {profileData.lastlogin
                      ? new Date(profileData.lastlogin).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true, // 24-hour format
                          }
                        )
                      : "—"}
                  </span>
                </p>
              </span>
            </div>
            <div className="p-2">
              <Dropdown items={dropdownItems} />
            </div>
          </div>

          {/* Profile Info Grid */}
          <div className="dark:bg-layout-dark bg-layout-light text-black dark:text-white rounded-lg p-6">
            <p className="text-lg font-semibold pb-6">Profile Info</p>
            <div className="grid grid-cols-2 gap-y-4 gap-x-12">
              {profileFields.map(({ label, key, format }) => (
                <React.Fragment key={key}>
                  <div className="col-span-1">
                    <p className="text-sm font-semibold">{label}</p>
                  </div>
                  <div className="col-span-1 text-end">
                    <p className="text-sm text-gray-500">
                      {format
                        ? format(profileData[key])
                        : profileData[key] || "—"}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Right WFH Leave Component */}
        <div className="lg:col-span-7 md:grid-cols-1 dark:bg-layout-dark bg-layout-light h-fit px-4 py-2 rounded-xl dark:text-white text-black">
          <WFH_Leave
            employeeId={employee_id}
            reportingPerson={profileData.rpperson}
            role={role_name}
          />
        </div>
      </div>

      {/* Modals */}
      {editProfile && (
        <Edit_Profile
          onclose={() => setEditProfile(false)}
          employeeId={employee_id}
          onSuccess={fetchProfile}
        />
      )}
      {changePassword && (
        <Change_Password
          onclose={() => setChangePassword(false)}
          employeeId={employee_id}
        />
      )}
    </div>
  );
};

export default Profile;
