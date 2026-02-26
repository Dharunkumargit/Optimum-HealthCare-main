import React from "react";
import NavBar from "../../../component/NavBar";
import Admin_Dashboard from "../new_dashboard/Admin_Dashboard";
import Employee_Dashboard from "../new_dashboard/Employee_Dashboard";

const Dashboard_Tab = () => {
  const user = JSON.parse(localStorage.getItem("employee")); // get logged-in user
  const roleName = user?.department.toLowerCase(); // "admin", "doctor", etc.

  return (
    <div className="flex flex-col h-full w-full">
      {/* Fixed Navbar */}
      <div className="flex-shrink-0">
        <NavBar
          title="Dashboard"
          pagetitle={roleName === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto p-4 no-scrollbar">
        {roleName === "admin" ? <Admin_Dashboard /> : <Employee_Dashboard />}
      </div>
    </div>
  );
};

export default Dashboard_Tab;
