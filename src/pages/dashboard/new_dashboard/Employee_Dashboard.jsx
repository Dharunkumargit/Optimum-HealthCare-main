import React, { useEffect, useState } from "react";
import { TbProgress } from "react-icons/tb";
import { Calendar } from "lucide-react";
import { FaStar } from "react-icons/fa";
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
import axios from "axios";
import { API } from "../../../Constant";

const Employee_Dashboard = () => {
  const [isDark, setIsDark] = useState(false);

  // --- API-driven states ---
  const [leadCount, setLeadCount] = useState(0);
  const [leaddata, setLeaddata] = useState([]);
  const [ipdCount, setIpdCount] = useState(0);
  const [opdCount, setOpdCount] = useState(0);
  const [performers, setPerformers] = useState([]);
  const [follow_up, setFollowUp] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const employee = JSON.parse(localStorage.getItem("employee"));

  // --- Static chart & color data ---
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

  const campaignData = [
    { name: "Instagram", value: 50 },
    { name: "X", value: 30 },
    { name: "Facebook", value: 20 },
  ];

  const COLORS = ["#F39C12", "#FF6384", "#FFCE56"];

  const events = [
    { title: "New Cardiology Wing Opening", date: "2023-07-10" },
    { title: "Pediatrics Department Expansion", date: "2023-07-05" },
    { title: "Hospital Anniversary Celebration", date: "2023-07-01" },
  ];

  // --- Fetch employee dashboard data ---
  useEffect(() => {
    fetchEmployeeDashboard();

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

  const fetchEmployeeDashboard = async () => {
    try {
      const [leadRes, apptRes, topRes] = await Promise.all([
        axios.get(`${API}/lead/getallleads`, {
          params: { role_name: employee.department, name: employee.name },
        }),

        axios.get(`${API}/appointment/getallappointments`),
        axios.get(`${API}/lead/getallleads`, {
          params: { role_name: "admin", name: employee.name },
        }),
      ]);

      const leads = leadRes.data?.data || [];
      const appts = apptRes.data?.data || [];
      const top = topRes.data?.data || [];


      // Counts
      setLeadCount(leads.length);
      setIpdCount(appts.filter((a) => a.patient_type === "IPD").length);
      setOpdCount(appts.filter((a) => a.patient_type === "OPD").length);

      // Follow-ups
      setFollowUp(
        leads
          .sort((a, b) => {
            if (a.status === "New" && b.status !== "New") return -1;
            if (a.status !== "New" && b.status === "New") return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .slice(0, 5)
          .map((l) => ({
            name: l.name,
            source: l.source || "Online",
            date: l.createdAt
              ? new Date(l.createdAt).toLocaleDateString("en-GB")
              : "-",
            status: l.status || "New",
          }))
      );

      // Appointments
      setAppointments(
        appts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((a) => ({
            patient: a.patient_name,
            department: a.treatment,
            appointmentDate: new Date(a.op_date || a.date).toLocaleDateString(
              "en-GB"
            ),
            doctor: a.surgeon_name || a.consultant,
          }))
      );

      const performerMap = {};

      top.forEach((lead) => {
        if (!lead.bdname) return;

        if (!performerMap[lead.bdname]) {
          performerMap[lead.bdname] = { converted: 0 };
        }

        if (lead.status?.toLowerCase() === "converted") {
          performerMap[lead.bdname].converted += 1;
        }
      });

      // Find top employee
      const topEmployee = Object.entries(performerMap)
        .map(([name, val]) => ({
          name,
          converted: val.converted,
        }))
        .sort((a, b) => b.converted - a.converted)[0]; // TOP ONE ONLY

      setPerformers(topEmployee ? [topEmployee] : []);
    } catch (err) {
      console.error("Employee dashboard fetch failed", err);
    }
  };

  // --- Stats cards ---
  const statsData = [
    { title: "Leads", value: leadCount, footer: "My Leads" },
    { title: "In Patient Details", value: ipdCount, footer: "Total IPD" },
    { title: "Out Patient Details", value: opdCount, footer: "Total OPD" },
    { title: "Total Revenue", value: "1,245", footer: "Total Revenue" },
  ];

  return (
    <div>
      <div className="my-2 grid grid-cols-1 lg:grid-cols-9 gap-3 ">
        <div className="lg:col-span-6 space-y-6">
          {/* --- Stats Cards --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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

          {/* --- Today Follow-Up --- */}
          <div className="md:col-span-1 lg:col-span-4 dark:text-white px-2 text-black rounded-xl">
            <p className="font-semibold text-xl mb-3">Today Follow-Up</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="dark:bg-black/30 border-b-2 pb-2 dark:border-overall_bg-dark border-overall_bg-light bg-layout-light">
                    <th className="p-2 rounded-l-md">Name</th>
                    <th className="p-2">Source</th>
                    <th className="p-2">Date</th>
                    <th className="p-2 rounded-r-md">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {follow_up.map((fu, idx) => (
                    <tr
                      key={idx}
                      className="dark:bg-black/30 border-b-2 dark:border-overall_bg-dark border-overall_bg-light bg-layout-light text-center"
                    >
                      <td className="px-2 py-3 text-sm rounded-l-md">
                        {fu.name}
                      </td>
                      <td className="p-2 text-sm font-semibold">{fu.source}</td>
                      <td className="p-2 text-sm">{fu.date}</td>
                      <td className="p-2 text-sm w-32 px-5 items-center rounded-r-md">
                        <p className="border w-28 dark:bg-overall_bg-dark bg-overall_bg-light text-gray-600 dark:text-white font-medium dark:border-layout-dark border-layout-light rounded-md py-1">
                          {fu.status}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Upcoming Appointments --- */}
          <div className="md:col-span-1 lg:col-span-4 dark:text-white px-2 text-black rounded-xl">
            <p className="font-semibold text-xl mb-3">Upcoming IPD/OPD</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="dark:bg-black/30 border-b-2 pb-2 dark:border-overall_bg-dark border-overall_bg-light bg-layout-light">
                    <th className="px-2 py-3 rounded-l-md">Patient</th>
                    <th className="p-2">Department</th>
                    <th className="p-2">Appointment Date</th>
                    <th className="p-2 rounded-r-md">Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt, idx) => (
                    <tr
                      key={idx}
                      className="dark:bg-black/30 border-b-2 dark:border-overall_bg-dark border-overall_bg-light bg-layout-light rounded-lg text-center"
                    >
                      <td className="px-2 py-3 text-sm rounded-l-md">
                        {appt.patient}
                      </td>
                      <td className="p-2">{appt.department}</td>
                      <td className="p-2">{appt.appointmentDate}</td>
                      <td className="p-2 text-sm rounded-r-md">
                        {appt.doctor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- Right Side: Star Performer & Events --- */}
        <div className="lg:col-span-3 space-y-3 mt-6 lg:mt-0">
          <div className="dark:bg-layout-dark bg-layout-light dark:text-white text-black p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Star Performer of the Week</h2>
            {performers.length > 0 ? (
              <center>
                <p className="text-lg font-bold flex justify-center">
                  {performers[0].name}
                  <span className="flex items-center ml-2 gap-1 px-2 text-sm dark:bg-overall_bg-dark bg-overall_bg-light rounded-3xl ">
                    {performers[0].rating}{" "}
                    <FaStar size={14} className="text-yellow-400" />
                  </span>
                </p>
                {performers[0].dept && (
                  <p className="text-xs text-gray-400 py-1">
                    {performers[0].dept}
                  </p>
                )}
                <p className="text-xs text-gray-400 flex items-center justify-center">
                  Top Rated
                </p>
              </center>
            ) : (
              <p className="text-center text-gray-400">No performers yet</p>
            )}
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

          <div className="dark:bg-layout-dark bg-layout-light dark:text-white text-black p-4 rounded-xl">
            <h2 className="font-semibold pb-2">My Notes</h2>
            <textarea
              name="notes"
              id="notes"
              className="w-full outline-none dark:bg-gray-600 bg-gray-200 dark:text-white text-black rounded-md px-2 py-1"
              rows={4}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee_Dashboard;
