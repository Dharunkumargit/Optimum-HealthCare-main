import React from "react";
import NavBar from "../../component/NavBar";
import RevenueChart from "./RevenueChart";
import CampaignChart from "./CampaignChart";
import RecentAppointments from "./RecentAppointment";
import RecentCampaigns from "./RecentCampaign";
import QuickActions from "./QuickActions";

const Dashboard = () => {
  return (
    <>
     <NavBar title="Dashboard" pagetitle="Main Dashboard"/>
      <div className="grid grid-cols-3  gap-2">
        <div className="col-span-2 relative ">
          <RevenueChart />
          <div className="absolute right-0 top-10 h-72 border-[1px] border-gray-400"></div>
        </div>
        <div className="">
          <CampaignChart />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="">
          <RecentAppointments/>
        </div>
        <div className="">
          <RecentCampaigns />
        </div>
        <div className="">
          <QuickActions/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
