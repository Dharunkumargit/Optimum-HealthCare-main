import React, { useState } from "react";
import NavBar from "../../component/NavBar";
import { TbReportMoney } from "react-icons/tb";
import { TbReport } from "react-icons/tb";
import Campaign_Report from "./Campaign_Report";
import Revenue_Report from "./Revenue_Report";


const Report = () => {
  const [activeTab, setActiveTab] = useState("1");
  return (
    <>
      <NavBar
        title="Leads"
        pagetitle={activeTab === "1" ? "Revenue Report" : "Campaign Report "}
      />
      <div className="cursor-pointer flex justify-between items-center ">
        <div className="font-layout-font flex gap-2  py-2 dark:text-white">
          <p
            className={`flex gap-2 items-center px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "1" ? "dark:bg-layout-dark bg-layout-light " : ""
            }`}
            onClick={() => setActiveTab("1")}
          >
            <TbReportMoney size={24}/> Revenue Report 
          </p>
          <p
            className={`flex  gap-2  items-center  px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "2" ? "dark:bg-layout-dark bg-layout-light" : ""
            }`}
            onClick={() => setActiveTab("2")}
          >
           <TbReport size={24}/> Campaign Report
          </p>
        </div>
      </div>
      {activeTab === "1" ?<Revenue_Report />  : <Campaign_Report/> }
    </>
  );
};

export default Report;
