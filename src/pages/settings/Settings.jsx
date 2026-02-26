import React, { useState } from "react";
import NavBar from "../../component/NavBar";
import { LuUsers } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi2";
import User from "./users/User";
import Roles from "./roles/Roles";
import Master from "./master/Master";
import { FiLock } from "react-icons/fi";




const Settings = () => {
  const [activeTab, setActiveTab] = useState("1");
  return (
    <>
      <NavBar
        title="Settings"
       pagetitle={
          activeTab === "1"
            ? "User"
            : activeTab === "2"
            ? "Roles"
            : "Master"
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
            <LuUsers size={24}/> User
          </p>
          <p
            className={`flex  gap-2  items-center  px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "2" ? "dark:bg-layout-dark bg-layout-light" : ""
            }`}
            onClick={() => setActiveTab("2")}
          >
           <HiOutlineUserGroup size={24}/> Roles
          </p>
             <p
            className={`flex gap-2 items-center px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "3" ? "dark:bg-layout-dark bg-layout-light" : ""
            }`}
            onClick={() => setActiveTab("3")}
          >
            <HiOutlineUserGroup size={22} /> Master
          </p>
        </div>
      </div>
       {activeTab === "1" ? (
        <User />
      ) : activeTab === "2" ? (
        <Roles />
      ) : (
        < Master/>
      )}
    </>
  );
};

export default Settings;
