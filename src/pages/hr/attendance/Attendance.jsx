import React, { useEffect, useState } from "react";
import { TbFileExport } from "react-icons/tb";
import { BiFilterAlt } from "react-icons/bi";
import { Check, X } from "lucide-react";
import { HiArrowsUpDown } from "react-icons/hi2";
import Pagination from "../../../component/Pagination";
import Filter from "../../../component/Filter";
import { useSearch } from "../../../component/SearchBar";
import axios from "axios";
import { API } from "../../../Constant";
import { BsFileBreak } from "react-icons/bs";

const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push({
      date: date.getDate().toString(),
      day: date
        .toLocaleDateString("en-US", { weekday: "short" })
        .charAt(0)
        .toUpperCase(),
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const Attendance = () => {
  const { searchTerm } = useSearch();
  const user = JSON.parse(localStorage.getItem("employee")); // logged-in user
  const employee_id = user?.employee_id;
  const role_name = user?.role?.role_name;

  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterModal, setFilterModal] = useState(false);
  const [filterParams, setFilterParams] = useState({
    fromdate: "",
    todate: "",
  });

  const itemsPerPage = 10;

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API}/employee/getattendance`, {
        params: {
          month,
          year,
          role: role_name,
          employee_id,
        },
      });

      if (role_name === "admin") {
        setAttendance(res.data.data);
      } else {
        setAttendance(res.data.data); // [{ name: "Me", attendance: [...] }]
      }
    } catch (error) {
      console.error(error);
      setAttendance([]);
    }
  };

  useEffect(() => {
    setDays(getDaysInMonth(month, year));
  }, [month, year]);

  useEffect(() => {
    fetchAttendance();
  }, [month, year, filterParams]);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = attendance.filter((item) =>
      item.name.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, attendance]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilter = ({ fromdate, todate }) => {
    setFilterParams({ fromdate, todate });
    setFilterModal(false);
    setCurrentPage(1);
  };

  const showColumns = role_name === "admin";

  return (
    <div className="relative dark:text-white">
      {/* Header */}
      <div className="font-layout-font absolute -top-13 right-0 flex justify-end items-center gap-2 pb-2">
        <div className="mt-4 lg:mt-0 flex flex-wrap items-center gap-3">
          <div className="text-base">
            <span className="font-semibold">Date:</span>{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
          {/* Month/Year selectors */}
          <select
            className="px-2 py-1 rounded border"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <option className="bg-layout-dark" key={idx} value={idx}>
                {new Date(0, idx).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            className="px-2 py-1 rounded border"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }).map((_, idx) => {
              const y = new Date().getFullYear() - 2 + idx;
              return (
                <option className="bg-layout-dark" key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>

          {/* 
          <p className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md">
            <TbFileExport />
            Export
          </p>

          <p
            className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md"
            onClick={() => setFilterModal(true)}
          >
            <BiFilterAlt size={18} />
            Filter
          </p> */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto no-scrollbar mt-20">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-sm dark:bg-layout-dark bg-white border-b-[3px] dark:border-overall_bg-dark border-light-blue">
              {showColumns && (
                <th className="rounded-l-md px-2 pl-5 py-1">S.No</th>
              )}
              {showColumns && (
                <th className="px-2 py-1 flex items-center justify-center gap-1 pt-[14px]">
                  Name <HiArrowsUpDown size={18} />
                </th>
              )}
              {days.map((d, i) => (
                <th key={i} className="px-2 py-1.5 text-xs">
                  {d.date}
                  <br />
                  <p className="font-light text-xs py-1">{d.day}</p>
                </th>
              ))}
              {showColumns && (
                <th className="rounded-r-md px-2 py-1 pr-5">Total</th>
              )}
            </tr>
          </thead>
          <tbody className="text-greyish dark:bg-layout-dark bg-white text-sm">
            {days.length > 0 && paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const today = new Date();

                return (
                  <tr
                    key={idx}
                    className="border-light-blue border-b-2 dark:border-overall_bg-dark"
                  >
                    {/* Serial No. */}
                    {showColumns && (
                      <td className="rounded-l-md text-center">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                    )}

                    {/* Employee Name */}
                    {showColumns && <td className="p-3">{row.name}</td>}

                    {/* Attendance per day */}
                    {days.map((day, i) => {
                      const currentDay = new Date(
                        year,
                        month,
                        parseInt(day.date)
                      );

                      // Find attendance record for this date
                      const att = row.attendance?.find((a) => {
                        if (!a.date) return false;
                        const d = new Date(a.date);
                        return (
                          d.getDate() === currentDay.getDate() &&
                          d.getMonth() === currentDay.getMonth() &&
                          d.getFullYear() === currentDay.getFullYear()
                        );
                      });

                      let content = "-";
                      let colorClass = "";
                      let tooltip = "";

                      if (currentDay > today) {
                        // Future date → show dash
                        content = "-";
                      } else if (att) {
                        // Attendance exists
                        const loginTime = new Date(
                          att.date
                        ).toLocaleTimeString();
                        tooltip = att.remarks
                          ? `${att.remarks} (${loginTime})`
                          : `Login: ${loginTime}`;

                        if (!att.present) {
                          // Marked absent in record
                          content = <X size={16} />;
                          colorClass = "text-red-600";
                        } else if (
                          att.remarks?.toLowerCase().includes("late")
                        ) {
                          // Late → orange ⚠️
                          content = (
                            <span className="text-orange-600 text-lg">⚠️</span>
                          );
                          colorClass = "text-orange-400";
                        } else {
                          // Present → green check
                          content = <Check size={16} />;
                          colorClass = "text-green-600";
                        }
                      } else if (currentDay < today) {
                        // Past date but no record → mark Absent
                        content = <X size={16} />;
                        colorClass = "text-red-600";
                        tooltip = "Absent";
                      }

                      return (
                        <td
                          key={i}
                          className={`px-2 text-center ${colorClass}`}
                          title={tooltip}
                        >
                          {content}
                        </td>
                      );
                    })}

                    {/* Total Present / Total Days */}
                    {showColumns && (
                      <td className="rounded-r-md px-2 text-center">
                        {
                          // Count of present days up to today
                          days.reduce((acc, day) => {
                            const currentDay = new Date(
                              year,
                              month,
                              parseInt(day.date)
                            );

                            const att = row.attendance?.find((a) => {
                              if (!a.date) return false;
                              const d = new Date(a.date);
                              return (
                                d.getDate() === currentDay.getDate() &&
                                d.getMonth() === currentDay.getMonth() &&
                                d.getFullYear() === currentDay.getFullYear()
                              );
                            });

                            if (currentDay > today) return acc;
                            return acc + (att?.present ? 1 : 0);
                          }, 0)
                        }
                        /
                        {
                          // Total working days until today
                          days.filter(
                            (d) =>
                              new Date(year, month, parseInt(d.date)) <= today
                          ).length
                        }
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              // No data case
              <tr>
                <td
                  colSpan={showColumns ? days.length + 3 : days.length}
                  className="text-center text-gray-400 py-4 font-medium"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {filterModal && (
        <Filter onclose={() => setFilterModal(false)} onFilter={handleFilter} />
      )}
    </div>
  );
};

export default Attendance;
