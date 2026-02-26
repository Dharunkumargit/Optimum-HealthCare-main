import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../../../component/Pagination";
import Filter from "../../../component/Filter";
import { CiCalendar } from "react-icons/ci";
import { TbCalendarTime, TbFileExport } from "react-icons/tb";
import { HiArrowsUpDown } from "react-icons/hi2";
import { LuEye } from "react-icons/lu";
import { Pencil } from "lucide-react";

import Calendar from "./Calendar";
import CreateAppointment from "./CreateAppointment";
import Completed from "./Completed";
import Reschedule from "./Reschedule";
import ViewAppoinment from "./ViewAppoinment";
import EditAppointment from "./EditAppointment";

import { API, formatDate } from "../../../Constant";
import usePermission from "../../../hooks/UsePermissions";
import { useSearch } from "../../../component/SearchBar";
import NavBar from "../../../component/NavBar";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Appointment_Tab = ({ user }) => {
  const itemsPerPage = 10;

  const { hasPermission } = usePermission(user);
  const { searchTerm } = useSearch();

  // 🔑 Role-based permissions
  const canView = hasPermission("Appointments", "View");
  const canCreate = hasPermission("Appointments", "Create");
  const canEdit = hasPermission("Appointments", "Edit");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterParams, setFilterParams] = useState({
    fromdate: "",
    todate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [createAppointment, setCreateAppointment] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewCalendar, setViewCalendar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isView, setIsView] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // ✅ Fetch Appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/appointment/getallappointments`);

      setAppointments(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [createAppointment]);

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setEditModalOpen(true);
  };

  // ✅ Filter + Search Logic
  const filteredData = useMemo(() => {
    return appointments
      .filter((app) => {
        // Date filtering
        if (!filterParams.fromdate && !filterParams.todate) return true;
        const Created = new Date(app.createdAt || app.CreatedAt);
        if (filterParams.fromdate && Created < new Date(filterParams.fromdate))
          return false;
        if (filterParams.todate && Created > new Date(filterParams.todate))
          return false;
        return true;
      })
      .filter((item) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          item.patient_name?.toLowerCase().includes(term) ||
          item.surgeon_name?.toLowerCase().includes(term) ||
          item.status?.toLowerCase().includes(term) ||
          item.token_id?.toLowerCase().includes(term)
        );
      });
  }, [appointments, filterParams, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterParams, searchTerm]);

  const STATUS_COLORS = {
    Pending: "text-yellow-500",
    Completed: "text-green-800",
    Confirmed: "text-blue-800",
    Cancelled: "text-red-800",
  };

  // Export filtered appointments to PDF
  const exportToPDF = () => {
    const doc = new jsPDF("l", "mm", "a4"); // Landscape A4

    doc.setFontSize(14);
    doc.text("Appointments Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [
        [
          "S.No",
          "Token ID",
          "Patient ID",
          "Patient Name",
          "Age",
          "Treatment",
          "Surgeon",
          "Coordinator",
          "Status",
        ],
      ],
      body:filteredData.map((app, index) => [
        index + 1,
        app.token_id,
        app.patient_type === "OPD" ? app.opd_number : app.ipd_number,
        app.patient_name,
        app.age,
        app.treatment,
        app.surgeon_name,
        app.medical_coordinator,
        app.status || "-",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 20 },
    });

    doc.save("Appointments.pdf");
  };

  // Export filtered appointments to Excel
  const exportToExcel = () => {
    const data = filteredData.map((app) => ({
      "Token ID": app.token_id,
      "Patient ID":
        app.patient_type === "OPD" ? app.opd_number : app.ipd_number,
      "Patient Name": app.patient_name,
      Age: app.age,
      Treatment: app.treatment,
      Surgeon: app.surgeon_name,
      Coordinator: app.medical_coordinator,
      Status: app.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "appointments.xlsx");
  };

  return (
    <>
      <NavBar title="Appointment" pagetitle="IPD / OPD Appointment" />
      {!viewCalendar && (
        <div className="mt-16">
          {/* ---------- Top Action Bar ---------- */}
          <div className="relative">
            <div className="font-layout-font absolute -top-13 right-0 flex justify-end items-center gap-2 pb-2">
              {canCreate && (
                <p
                  onClick={() => setCreateAppointment(true)}
                  className="cursor-pointer flex items-center dark:text-white gap-2 bg-select_layout-dark px-4 py-2 text-sm rounded-md"
                >
                  <TbCalendarTime size={18} />
                  Create Appointment
                </p>
              )}

              <p
                onClick={() => setViewCalendar(true)}
                className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md"
              >
                <CiCalendar size={18} className="stroke-1" />
                Calendar
              </p>

              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <p
                  onClick={() => setExportOpen((prev) => !prev)}
                  className="cursor-pointer flex items-center gap-1.5 
               dark:text-white dark:bg-layout-dark bg-layout-light 
               px-4 py-2 rounded-md"
                >
                  <TbFileExport />
                  Export
                </p>

                {exportOpen && (
                  <div
                    className="absolute right-0 mt-2 w-44 rounded-md shadow-lg z-50
                 bg-white dark:bg-layout-dark
                 border border-gray-200 dark:border-gray-700"
                  >
                    <button
                      onClick={() => {
                        exportToPDF();
                        setExportOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm
                   text-black dark:text-white
                   hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export PDF
                    </button>

                    <button
                      onClick={() => {
                        exportToExcel();
                        setExportOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm
                   text-black dark:text-white
                   hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export Excel
                    </button>
                  </div>
                )}
              </div>

              <Filter onFilterChange={setFilterParams} />
            </div>
          </div>

          {/* ---------- Table ---------- */}
          <div className="font-layout-font overflow-auto no-scrollbar">
            <table className="w-full xl:h-fit h-[703px] dark:text-white whitespace-nowrap">
              <thead>
                <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
                  <th className="p-3.5 rounded-l-lg">S.no</th>
                  {[
                    "Token ID",
                    "Patient ID",
                    "Patient Name",
                    "Age",
                    "Treatment",
                    "Surgeon",
                    "Coordinator",
                    "Status",
                  ].map((heading) => (
                    <th key={heading} className="p-5">
                      <h1 className="flex items-center justify-center gap-1">
                        {heading}
                        <HiArrowsUpDown className="dark:text-white" />
                      </h1>
                    </th>
                  ))}
                  {canView && <th className="pr-2 rounded-r-lg">Action</th>}
                </tr>
              </thead>

              <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
                {paginatedData.length > 0 ? (
                  paginatedData.map((data, index) => (
                    <tr
                      key={index}
                      className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                    >
                      <td className="rounded-l-lg p-2.5">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td>{data.token_id}</td>
                      <td>
                        {data.patient_type === "OPD"
                          ? data.opd_number
                          : data.ipd_number}
                      </td>
                      <td>{data.patient_name}</td>
                      <td>{data.age}</td>
                      <td>{data.treatment}</td>
                      <td>{data.surgeon_name}</td>
                      <td>{data.medical_coordinator}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[data.status] ||
                            "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {data.status || "-"}
                        </span>
                      </td>

                      {canView && (
                        <td className="space-x-2 p-2.5 rounded-r-lg">
                          {canEdit && (
                            <button
                              className="cursor-pointer bg-blue-200 p-1.5 rounded-sm"
                              onClick={() => handleEdit(data)}
                            >
                              <Pencil size={16} className="text-blue-600" />
                            </button>
                          )}
                          <button
                            className="cursor-pointer bg-green-200 p-1.5 rounded-sm"
                            onClick={() => {
                              setSelectedAppointment(data);
                              setIsView(true);
                            }}
                          >
                            <LuEye size={16} className="text-green-600" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={canView ? 10 : 9}
                      className="text-center py-10 text-gray-500"
                    >
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ---------- Pagination ---------- */}
          <Pagination
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          {/* ---------- Modals ---------- */}
          {editModalOpen && selectedAppointment && (
            <EditAppointment
              onclose={() => setEditModalOpen(false)}
              appointment={selectedAppointment}
              onSuccess={fetchAppointments}
            />
          )}

          {createAppointment && (
            <CreateAppointment
              onclose={() => setCreateAppointment(false)}
              refresh={fetchAppointments}
              apiEndpoint="add"
            />
          )}

          {isModalOpen && selectedStatus === "completed" && (
            <Completed onclose={() => setIsModalOpen(false)} />
          )}

          {isModalOpen && selectedStatus === "reschedule" && (
            <Reschedule onclose={() => setIsModalOpen(false)} />
          )}

          {isView && (
            <ViewAppoinment
              onclose={() => setIsView(false)}
              data={selectedAppointment}
            />
          )}
        </div>
      )}

      {viewCalendar && <Calendar onclose={() => setViewCalendar(false)} />}
    </>
  );
};

export default Appointment_Tab;
