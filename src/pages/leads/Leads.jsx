import React, { useState } from "react";
import NavBar from "../../component/NavBar";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { TbClipboardList } from "react-icons/tb";
import Campaign from "./campaign/Campaign";
import Leads_Tab from "./leads/Leads_Tab";

const Leads = () => {
  const [activeTab, setActiveTab] = useState("1");
  return (
    <>
      <NavBar
        title="Leads"
        pagetitle={activeTab === "1" ? "Campaign" : "Leads Table"}
      />
      <div className="cursor-pointer flex justify-between items-center ">
        <div className="font-layout-font flex gap-2  py-2 dark:text-white">
          <p
            className={`flex gap-2 items-center px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "1" ? "dark:bg-layout-dark bg-layout-light " : ""
            }`}
            onClick={() => setActiveTab("1")}
          >
            <TbBrandCampaignmonitor size={24}/> Campaign
          </p>
          <p
            className={`flex  gap-2  items-center  px-4 py-3 font-semibold rounded-sm text-sm ${
              activeTab === "2" ? "dark:bg-layout-dark bg-layout-light" : ""
            }`}
            onClick={() => setActiveTab("2")}
          >
           <TbClipboardList size={24}/> Leads
          </p>
        </div>
      </div>
      {activeTab === "1" ? <Campaign/> : <Leads_Tab />}
    </>
  );
};

export default Leads;
