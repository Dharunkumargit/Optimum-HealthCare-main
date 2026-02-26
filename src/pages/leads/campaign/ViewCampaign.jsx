import React, { useEffect, useState } from "react";
import NavBar from "../../../component/NavBar";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import LeadsTable from "./LeadsTable";
import AppointmentsTable from "./AppointmentsTable";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API, formatDate } from "../../../Constant";
import AddLeads from "./AddLeads";
import CreateAppointment from "../../appointment/appointment/CreateAppointment";

const ViewCampaign = () => {
  const [isOpenLeads, setIsOpenLeads] = useState(false);
  const [isOpenAppointments, setIsOpenAppointments] = useState(false);
  const [isOpenAddleads, setIsOpenAddLeads] = useState(false);
  const [isOpenAddAppointments, setIsOpenAddAppointments] = useState(false);

  const [campaignDetails, setCampaignDetails] = useState(null);
  const [leadsData, setLeadsData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);

  const location = useLocation();
  const campaignId = location.state?.id;
  const campaignId1 = location.state?.campid;

  const toggleOpen = () => setIsOpenLeads(!isOpenLeads);
  const toggleOpen1 = () => setIsOpenAppointments(!isOpenAppointments);

  // Fetch campaign details
  const fetchCampaignDetails = async () => {
    try {
      const res = await axios.get(`${API}/campaign/${campaignId}`);

      setCampaignDetails(res.data.data || null);
      setLeadsData(res.data.data.leads || []);
      setAppointmentsData(res.data.data.appointments || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch campaign details");
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails();
    }
  }, [campaignId]);
  const leadsCount = campaignDetails?.leads.length || 0;
  const appointmentsCount = campaignDetails?.appointments.length || 0;
  const totalExpense = campaignDetails?.budget || 0;
  // const totalRevenue = campaignDetails.totalRevenue || 0;
  const cpl = (totalExpense / leadsCount).toFixed(2) || 0;

  return (
    <>
      <NavBar title="Campaign" pagetitle="View Campaign" />
      <div className="flex gap-4 justify-end items-center mt-4">
        <button
          onClick={() => setIsOpenAddLeads(true)}
          className="dark:bg-select_layout-dark bg-select_layout-light dark:text-white text-black px-2 py-1 rounded "
        >
          Add Leads
        </button>
        {/* <button
          onClick={() => setIsOpenAddAppointments(true)}
          className="dark:bg-select_layout-dark bg-select_layout-light dark:text-white text-black px-2 py-1 rounded "
        >
          Add Appointments
        </button> */}
      </div>
      <div className="font-roboto-flex grid lg:grid-cols-12 md:grid-cols-9 grid-cols-3 gap-3 dark:text-white my-6">
        <div className="col-span-3 p-4 space-y-4 dark:bg-layout-dark bg-white w-full rounded-lg">
          <p className="font-bold text-base">Campaign Details</p>
          <div className="grid lg:grid-cols-5 grid-cols-4 gap-2 font-light text-xs">
            <p className="col-span-3">Name</p>
            <p className="col-span-1  first-letter:capitalize">
              {campaignDetails?.channelName || "-"}
            </p>
            <p className="col-span-3">Date</p>
            <p className="col-span-2">
              {formatDate(campaignDetails?.startDate) || "-"}
            </p>
          </div>
        </div>

        <div className="col-span-3 p-4 space-y-4 dark:bg-layout-dark bg-white w-full rounded-lg">
          <p className="font-bold text-base">Social Media Details</p>
          <div className="grid lg:grid-cols-5 grid-cols-4 gap-2 font-light text-xs">
            <p className="col-span-3">Platform</p>
            <p className="col-span-1  first-letter:capitalize">
              {campaignDetails?.channel || "-"}
            </p>
            <p className="col-span-3">Link</p>
            <p
              className="col-span-2 underline text-blue-500 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(campaignDetails?.fb_link);
                toast.success("Link copied!");
              }}
            >
              Campaign Link
            </p>
          </div>
        </div>

        <div className="col-span-3 p-4 space-y-4 dark:bg-layout-dark bg-white w-full rounded-lg">
          <p className="font-bold text-base">Leads Details</p>
          <div className="grid lg:grid-cols-5 grid-cols-4 gap-2 font-light text-xs">
            <p className="col-span-3">Leads Count</p>
            <p className="col-span-1">{leadsCount}</p>
            <p className="col-span-3">Appointments</p>
            <p className="col-span-1">{appointmentsCount}</p>
            <p className="col-span-3">Sales</p>
            <p className="col-span-1">{campaignDetails?.sales || 0}</p>
          </div>
        </div>

        <div className="col-span-3 p-4 space-y-4 dark:bg-layout-dark bg-white rounded-lg">
          <p className="font-bold text-base">Leads</p>
          <div className="grid lg:grid-cols-5 grid-cols-4 gap-2 font-light text-xs">
            <p className="col-span-3">Leads Cost</p>
            <p className="col-span-1">{campaignDetails?.leadsCost || 0}</p>
            <p className="col-span-3">CAC</p>
            <p className="col-span-1">{campaignDetails?.cac || 0}</p>
          </div>
        </div>

        <div className="col-span-6 p-3.5 dark:bg-layout-dark bg-white flex justify-between items-center w-full rounded-lg">
          <p className="font-bold text-base mx-4">Total Expense</p>
          <p className="text-select_layout-dark text-xs mx-4">{totalExpense}</p>
        </div>

        <div className="col-span-6 p-3.5 dark:bg-layout-dark bg-white flex justify-between items-center w-full rounded-lg">
          <p className="font-bold text-base mx-4">Total Revenue</p>
          <p className="text-select_layout-dark text-xs mx-4">
            {campaignDetails?.totalRevenue || 0}
          </p>
        </div>

        <div className="col-span-12 p-3.5 dark:bg-layout-dark bg-white w-full rounded-lg">
          <div
            onClick={toggleOpen}
            className="mx-4 flex justify-between items-center"
          >
            <p className="font-bold text-base">Leads</p>
            <p>{isOpenLeads ? <IoIosArrowUp /> : <IoIosArrowDown />}</p>
          </div>
        </div>
        {isOpenLeads && (
          <div className="w-full col-span-12">
            <LeadsTable data={leadsData} />
          </div>
        )}

        <div className="col-span-12 p-3.5 dark:bg-layout-dark bg-white w-full rounded-lg">
          <div
            onClick={toggleOpen1}
            className="mx-4 flex justify-between items-center"
          >
            <p className="font-bold text-base">Appointments</p>
            <p>{isOpenAppointments ? <IoIosArrowUp /> : <IoIosArrowDown />}</p>
          </div>
        </div>
        {isOpenAppointments && (
          <div className="w-full col-span-12">
            <AppointmentsTable data={appointmentsData} />
          </div>
        )}
      </div>
      {isOpenAddleads && (
        <AddLeads
          onclose={() => setIsOpenAddLeads(false)}
          campaignId1={campaignId1}
          fetchCampaignDetails={fetchCampaignDetails}
          Platform={campaignDetails.channel}
        />
      )}
      {isOpenAddAppointments && (
        <CreateAppointment
          onclose={() => setIsOpenAddAppointments(false)}
          campaignId={campaignId1}
          fetchCampaignDetails={fetchCampaignDetails}
          apiEndpoint="create"
        />
      )}
    </>
  );
};

export default ViewCampaign;
