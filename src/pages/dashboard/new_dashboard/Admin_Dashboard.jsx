import React, { useEffect, useState } from "react";
import NavBar from "../../../component/NavBar";
import { TbProgress } from "react-icons/tb";
import { Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { API } from "../../../Constant";

const Admin_Dashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const [leadCount, setLeadCount] = useState(0);
  const [ipdCount, setIpdCount] = useState(0);
  const [opdCount, setOpdCount] = useState(0);
  const [campaignData, setCampaignData] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [newLeads, setNewLeads] = useState([]);
  const [newAppointments, setNewAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const data = JSON.parse(localStorage.getItem("employee"));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [leadsRes, appointmentRes, campaignRes] = await Promise.all([
        axios.get(`${API}/lead/getallleads`, {
          params: { role_name: data.department, name: data.name },
        }),
        axios.get(`${API}/appointment/getallappointments`),
        axios.get(`${API}/campaign/allcampaigns`),
      ]);
      

      const leadCount = leadsRes.data?.data?.length || 0;

      setLeadCount(leadCount);

      const appointments = appointmentRes.data?.data || [];

      const ipdCount = appointments.filter(
        (item) => item.patient_type === "IPD"
      ).length;

      const opdCount = appointments.filter(
        (item) => item.patient_type === "OPD"
      ).length;

      setIpdCount(ipdCount);
      setOpdCount(opdCount);

      const buildChannelLeadGraph = (campaigns) => {
        const channelMap = {};

        campaigns.forEach((c) => {
          const channel = c.channel?.toLowerCase() || "other";
          const leadCount = c.leads?.length || 0;

          channelMap[channel] = (channelMap[channel] || 0) + leadCount;
        });

        return Object.entries(channelMap).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value,
        }));
      };

      const campaigns = campaignRes.data?.data || [];

      const channelLeadData = buildChannelLeadGraph(campaigns);

      setCampaignData(channelLeadData);

      const leads = leadsRes.data?.data || [];

      // Build top performers with rating
      const performerMap = {};

      leads.forEach((lead) => {
        const consultant = lead.bdname || "Unknown";
        if (!performerMap[consultant])
          performerMap[consultant] = { total: 0, converted: 0 };

        performerMap[consultant].total += 1;
        if (lead.status.toLowerCase() === "converted") {
          performerMap[consultant].converted += 1;
        }
      });

      const topPerformers = Object.entries(performerMap)
        .map(([name, val]) => ({
          name,
          dept: "", // optional if you want department
          rating:
            val.total > 0
              ? parseFloat(((val.converted / val.total) * 5).toFixed(1))
              : 0,
        }))
        .sort((a, b) => b.rating - a.rating) // sort by rating
        .slice(0, 5); // take top 5

      setPerformers(topPerformers);

      // Sort by createdAt descending (latest first)
      const sortedLeads = leads.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Take top 5
      setNewLeads(sortedLeads.slice(0, 5));

      const sortedAppointments = appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5); // latest 5

      setNewAppointments(sortedAppointments);
    } catch (err) {
      console.error("Failed to fetch top performers", err);
    }
  };

  const statsData = [
    { title: "Leads", value: leadCount, footer: "Total Leads" },
    { title: "In Patient Details", value: ipdCount, footer: "Total IPD" },
    { title: "Out Patient Details", value: opdCount, footer: "Total OPD" },
    { title: "Total Revenue", value: "1,245", footer: "Total Revenue" },
    { title: "Pending Payment", value: "1,245", footer: "Pending Payment" },
    { title: "Total Expense", value: "1,245", footer: "Total Expense" },
  ];

  const revenueData = [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 60 },
    { name: "Mar", value: 55 },
    { name: "Apr", value: 80 },
    { name: "May", value: 65 },
    { name: "Jun", value: 95 },
    { name: "Jul", value: 70 },
    { name: "Aug", value: 90 },
    { name: "Sep", value: 50 },
    { name: "Oct", value: 75 },
    { name: "Nov", value: 60 },
    { name: "Dec", value: 85 },
  ];

  // // const campaignData = [
  // //   { name: "Instagram", value: 50 },
  // //   { name: "X", value: 30 },
  // //   { name: "Facebook", value: 20 },
  // ];
  const COLORS = ["#F39C12", "#FF6384", "#FFCE56"];

  const leads = [
    {
      id: "#34325",
      patient: "John 34",
      doctor: "Mathew",
      contact: "97536 56774",
    },
    {
      id: "#34326",
      patient: "Alice 27",
      doctor: "Sophia",
      contact: "98765 43210",
    },
    {
      id: "#34327",
      patient: "David 41",
      doctor: "John",
      contact: "91234 56789",
    },
    {
      id: "#34327",
      patient: "David 41",
      doctor: "John",
      contact: "91234 56789",
    },
    {
      id: "#34327",
      patient: "David 41",
      doctor: "John",
      contact: "91234 56789",
    },
  ];

  const events = [
    { title: "New Cardiology Wing Opening", date: "2023-07-10" },
    { title: "Pediatrics Department Expansion", date: "2023-07-05" },
    { title: "Hospital Anniversary Celebration", date: "2023-07-01" },
  ];

  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // const performers = [
  //   { name: "Dr. Olivia Bennett", dept: "Neurology", rating: 4.9 },
  //   { name: "Dr. Ethan Clark", dept: "Cardiology", rating: 4.8 },
  //   { name: "Dr. Sophia Reed", dept: "Orthopedics", rating: 4.7 },
  //   { name: "Dr. Noah Carter", dept: "Dermatology", rating: 4.6 },
  //   { name: "Dr. Emma Hayes", dept: "Pediatrics", rating: 4.5 },
  // ];

  return (
    <div>
      {/* <NavBar title="Dashboard" pagetitle="Main Dashboard" /> */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="dark:bg-layout-dark bg-layout-light p-3 rounded-xl"
          >
            <div className="flex items-center justify-between border-l-4 border-[#81B2B8]">
              <div className="mx-2">
                <p className="text-green-600 text-[11px]">{stat.title}</p>
                <p className="dark:text-white text-black text-lg font-semibold">
                  {stat.value}
                </p>
              </div>
              <div className="dark:bg-[#25004C] bg-purple-800 rounded-xl p-2">
                <TbProgress
                  size={18}
                  className="dark:text-purple-900 text-purple-500"
                />
              </div>
            </div>
            <p className="dark:text-white text-black pt-3 text-xs">
              {stat.footer}
            </p>
          </div>
        ))}
      </div>
      <div className="my-2 grid grid-cols-1 lg:grid-cols-8 gap-3">
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 p-3 gap-3">
            <div className="md:col-span-1 lg:col-span-5 dark:text-white  lg:bg-none px-3 py-1 rounded-md text-black">
              <h2 className="font-semibold">Monthly Revenue</h2>
              <p className="text-xs text-gray-400 mb-4 space-x-1 w-full">
                <span className="border-r pr-1.5">X - Amount in thousand</span>
                <span>Y - Months</span>
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="name" stroke={isDark ? "#ccc" : "#333"} />
                  <YAxis stroke={isDark ? "#ccc" : "#333"} width={30} />
                  <Tooltip />
                  <Bar dataKey="value" fill={isDark ? "#5E52CE" : "#2563EB"} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="md:col-span-1 lg:col-span-3 lg:bg-none md:border-l py-2 rounded-md dark:border-gray-500 border-amber-50 px-4 dark:text-white text-black">
              <h2 className="font-semibold mb-4">Campaign</h2>
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
                <div className="w-full sm:w-1/2 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={campaignData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        cornerRadius={8}
                      >
                        {campaignData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="ml-0 sm:ml-4 mt-4 sm:mt-0 space-y-2 text-sm">
                  {campaignData.map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i] }}
                      ></span>
                      {c.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
            <div className="md:col-span-1 lg:col-span-4 dark:bg-layout-dark bg-layout-light dark:text-white text-black p-4 rounded-xl">
              <h2 className="font-semibold mb-3">New Leads</h2>
              <div className="space-y-2">
                {newLeads.map((lead, idx) => (
                  <div
                    key={idx}
                    className="dark:bg-black/30 bg-gray-200 rounded-lg p-2 flex justify-between"
                  >
                    <div className="text-sm space-y-1">
                      <p>{lead.lead_id}</p>
                      <p className="font-semibold">
                        Patient:{" "}
                        <span className="font-normal">{lead.name}</span>
                      </p>
                      <p>Contact no: {lead.phone}</p>
                    </div>
                    {/* <p className="text-sm">
                      Doctor:{" "}
                      <span className="font-normal">{lead.consultant}</span>
                    </p> */}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-1 lg:col-span-4 dark:bg-layout-dark bg-layout-light dark:text-white text-black p-4 rounded-xl">
              <h2 className="font-semibold mb-3">Upcoming IPD/OPD</h2>

              <div className="space-y-2">
                {newAppointments.map((appt, idx) => (
                  <div
                    key={idx}
                    className="dark:bg-black/30 bg-gray-200 rounded-lg p-2 flex justify-between"
                  >
                    <div className="text-sm space-y-1">
                      <p>
                        Patient:{" "}
                        <span className="font-semibold">
                          {appt.patient_name}
                        </span>
                      </p>
                      <p>
                        Type:{" "}
                        <span className="font-normal">{appt.patient_type}</span>
                      </p>
                      {/* <p>
                        Contact:{" "}
                        <span className="font-normal">{appt.phone}</span>
                      </p> */}
                      <p>
                        Treatment:{" "}
                        <span className="font-normal">{appt.treatment}</span>
                      </p>
                    </div>
                    <div className="text-sm text-right">
                      <p>
                        Doctor:{" "}
                        <span className="font-normal">
                          {appt.surgeon_name || appt.consultant}
                        </span>
                      </p>
                      <p>
                        Date:{" "}
                        <span className="font-normal">
                          {new Date(
                            appt.op_date || appt.date
                          ).toLocaleDateString()}
                        </span>
                      </p>
                      <p>
                        Time:{" "}
                        <span className="font-normal">
                          {appt.op_time || "-"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-3 mt-6 lg:mt-0">
          <div className="dark:bg-layout-dark bg-layout-light dark:text-white text-black p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Top 5 Performer of the Week</h2>
            <div className="space-y-3">
              {performers.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center dark:bg-overall_bg-dark bg-gray-200 px-2 rounded-md py-1"
                >
                  <p className="flex flex-col text-sm">
                    <span>{doc.name}</span>
                    <span className="text-gray-400">{doc.dept}</span>
                  </p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 dark:bg-layout-dark bg-layout-light rounded-3xl">
                    <p className="text-sm">{doc.rating}</p>
                    <FaStar size={11} className="text-yellow-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dark:bg-layout-dark bg-layout-light dark:text-white text-black p-4 rounded-xl">
            <h2 className="font-semibold mb-4">Latest Events & News</h2>
            <div className="relative border-l border-gray-500/50 ml-3">
              {events.map((event, idx) => (
                <div key={idx} className="mb-6 ml-4 relative">
                  <span className="absolute -left-8 flex items-center justify-center w-8 h-8 rounded-full dark:bg-layout-dark bg-layout-light">
                    <Calendar size={18} />
                  </span>
                  <div className="px-3">
                    <p className="text-sm">{event.title}</p>
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Dashboard;
