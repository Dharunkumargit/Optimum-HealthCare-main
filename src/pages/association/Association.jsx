import React, { useState } from "react";
import NavBar from "../../component/NavBar";
import { FaHospital } from "react-icons/fa";
import { PiStethoscopeFill } from "react-icons/pi";
import Hospital from "./hospital/Hospital";
import Doctor from "./doctor/Doctor";

const Association = () => {
  const [activeTab, setActiveTab] = useState("1");
  return (
    <>
      <NavBar
        title="Association"
        pagetitle={activeTab === "1" ? "Hospital" : "Doctor"}
      />
      <div className="cursor-pointer flex justify-between items-center ">
        <div className="font-layout-font flex gap-2  py-2 dark:text-white">
          <p
            className={`flex gap-2 items-center px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "1" ? "dark:bg-layout-dark bg-layout-light " : ""
            }`}
            onClick={() => setActiveTab("1")}
          >
            <FaHospital size={24}/> Hospital
          </p>
          <p
            className={`flex  gap-2  items-center  px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "2" ? "dark:bg-layout-dark bg-layout-light" : ""
            }`}
            onClick={() => setActiveTab("2")}
          >
           <PiStethoscopeFill size={24}/> Doctor
          </p>
        </div>
      </div>
      {activeTab === "1" ? <Hospital/> : <Doctor/>}
    </>
  );
};

export default Association;