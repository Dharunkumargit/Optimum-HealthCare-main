import React, { useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { CircleCheck } from 'lucide-react';
import { FolderSymlink } from 'lucide-react';
import {
  FaChartLine,
  FaUserCheck,
  FaUsers,
  FaMoneyBill,
  FaStar,
} from "react-icons/fa";
import IndicatorCard from "./IndicatorCard";
import CampaignRun from "./quick actions/CampaignRun";
import TotalLeads from "./quick actions/TotalLeads";
import TotalAppointments from "./quick actions/TotalAppointments";
import TotalPatients from "./quick actions/TotalPatients";
import TotalRevenue from "./quick actions/TotalRevenue";
import GoogleRatings from "./quick actions/GoogleRatings";

const QuickActions = () => {

  const [campaignRunModal,setCampaignRunModal] = useState(false)
  const [TotalLeadsModal,setTotalLeadsModal] = useState(false)
  const [TotalAppointmentModal,setTotalAppointmentModal] = useState(false)
  const [TotalPatientsModal,setTotalPatientsModal] = useState(false)
  const [TotalRevenueModal,setTotalRevenueModal] = useState(false)
  const [GoogleRatingsModal,setGoogleRatingsModal] = useState(false)


  return (
    <>
    <div className="grid gap-4">
      <div className="cursor-pointer" onClick = {() =>setCampaignRunModal(true)}>
      <IndicatorCard
        icon={<LuLoaderCircle size={24} />}
        label="Total Campaign Run"
        value={85}
        progress={85}
      />
      </div>
      <div className="cursor-pointer" onClick={ () =>setTotalLeadsModal(true)}>
      <IndicatorCard
        icon={<CircleCheck />}
        label="Total Leads Generated"
        value={65}
        progress={65}
      />
      </div>
      <div className="cursor-pointer" onClick={ () =>setTotalAppointmentModal(true)}>
      <IndicatorCard
        icon={<FolderSymlink />}
        label="Total Appointments"
        value={72}
        progress={72}
      />
      </div>
      <div className="cursor-pointer" onClick={ () =>setTotalPatientsModal(true)}>
      <IndicatorCard
        icon={<FaUsers  size={24}/>}
        label="Total Patients"
        value={66}
        progress={66}
      />
      </div>
      <div className="cursor-pointer" onClick={ () =>setTotalRevenueModal(true)}>
      <IndicatorCard
        icon={<FaMoneyBill size={24} />}
        label="Total Revenue"
        value={"45"}
        progress={45}
      />
      </div>
      <div className="cursor-pointer" onClick={ () =>setGoogleRatingsModal(true)}>
      <IndicatorCard
        icon={<FaStar size={24} />}
        label="Google Ratings"
        value={48}
        progress={48}
      />
      </div>
    </div>
    {campaignRunModal && <CampaignRun onclose={()=>setCampaignRunModal(false)}/>}
      {TotalLeadsModal && <TotalLeads onclose={ () =>setTotalLeadsModal(false)}/>}
        {TotalAppointmentModal && <TotalAppointments onclose={ () =>setTotalAppointmentModal(false)}/>}
          {TotalPatientsModal && <TotalPatients onclose={ () =>setTotalPatientsModal(false)}/>}
            {TotalRevenueModal && <TotalRevenue onclose={ () =>setTotalRevenueModal(false)}/>}
              {GoogleRatingsModal && <GoogleRatings onclose={ () =>setGoogleRatingsModal(false)}/>}
    </>
  );
};
export default QuickActions;
