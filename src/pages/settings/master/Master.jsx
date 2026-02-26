import React, { useState } from "react";
import { TbBuilding, TbCategory2, TbUsers } from "react-icons/tb";
import Department from "./department/Department";
import Category from "./category/Category";
import Roles from "./roles/Roles";



const Master = () => {
  const [activeTab, setActiveTab] = useState("department");

  return (
    <>


      {/* Tabs */}
      <div className="cursor-pointer flex justify-between items-center mb-4">
        <div className="font-layout-font flex gap-2 py-2 dark:text-white">
          {/* Department */}
          <p
            className={`flex gap-2 items-center px-4 py-3 font-semibold rounded-sm text-sm
              ${activeTab === "department"
                ? "dark:bg-layout-dark bg-layout-light"
                : "hover:bg-gray-100 dark:hover:bg-layout-dark"
              }`}
            onClick={() => setActiveTab("department")}
          >
            <TbBuilding size={22} /> Department
          </p>

          {/* Category */}
          <p
            className={`flex gap-2 items-center px-4 py-3 font-semibold rounded-sm text-sm
              ${activeTab === "category"
                ? "dark:bg-layout-dark bg-layout-light"
                : "hover:bg-gray-100 dark:hover:bg-layout-dark"
              }`}
            onClick={() => setActiveTab("category")}
          >
            <TbCategory2 size={22} /> Category
          </p>

          {/* Roles */}
          <p
            className={`flex gap-2 items-center px-4 py-3 font-semibold rounded-sm text-sm
              ${activeTab === "roles"
                ? "dark:bg-layout-dark bg-layout-light"
                : "hover:bg-gray-100 dark:hover:bg-layout-dark"
              }`}
            onClick={() => setActiveTab("roles")}
          >
            <TbUsers size={22} /> Roles
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "department" && <Department />}
        {activeTab === "category" && <Category />}
        {activeTab === "roles" && <Roles />}
      </div>
    </>
  );
};

export default Master;
