import React, { useState } from "react";
import NavBar from "../../component/NavBar";
import { FaHospital } from "react-icons/fa";
import { PiStethoscopeFill } from "react-icons/pi";
import Employee from "./employee/Employee";
import Attendance from "./attendance/Attendance";
import Leave from "./leave/Leave";
import PayRoll from "./payroll/PayRoll";
import WFH from "./wfh/WFH";

const Hr = () => {
  const [activeTab, setActiveTab] = useState("1");
  return (
    <>
      <NavBar
        title="HR"
        pagetitle={
          activeTab === "1"
            ? "Employee"
            : activeTab === "2"
            ? "Attendance"
            : activeTab === "3"
            ? "Leave"
            : activeTab === "4"
            ? "WFH"
            : "Payroll"
        }
      />
      <div className="cursor-pointer flex justify-between items-center ">
        <div className="font-layout-font flex gap-2  py-2 dark:text-white">
          <p
            className={`flex gap-2 items-center px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "1" ? "dark:bg-layout-dark bg-layout-light " : ""
            }`}
            onClick={() => setActiveTab("1")}
          >
            Employee
          </p>
          <p
            className={`flex  gap-2  items-center  px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "2" ? "dark:bg-layout-dark bg-layout-light" : ""
            }`}
            onClick={() => setActiveTab("2")}
          >
            Attendance
          </p>
          <p
            className={`flex  gap-2  items-center  px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "3" ? "dark:bg-layout-dark bg-layout-light" : ""
            }`}
            onClick={() => setActiveTab("3")}
          >
            Leave
          </p>
          <p
            className={`flex  gap-2  items-center  px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "4" ? "dark:bg-layout-dark bg-layout-light" : ""
            }`}
            onClick={() => setActiveTab("4")}
          >
            WFH
          </p> <p
            className={`flex  gap-2  items-center  px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "5" ? "dark:bg-layout-dark bg-layout-light" : ""
            }`}
            onClick={() => setActiveTab("5")}
          >
            Payroll
          </p>
        </div>
      </div>
      {activeTab === "1" ? (
        <Employee />
      ) : activeTab === "2" ? (
        <Attendance />
      ) : activeTab === "3" ? (
        <Leave />
      ) : activeTab === "4" ? (
        <WFH/>
      ) : (
        <PayRoll />
      )}
    </>
  );
};

export default Hr;
