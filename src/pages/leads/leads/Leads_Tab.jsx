import React, { useEffect, useState } from "react";
import { HiArrowsUpDown } from "react-icons/hi2";
import Pagination from "../../../component/Pagination";
import { LuEye } from "react-icons/lu";
import { Pencil } from "lucide-react";
import Filter from "../../../component/Filter";
import { TbFileExport } from "react-icons/tb";
import { useSearch } from "../../../component/SearchBar";
import Edit_leads from "./Edit_leads";
import { useNavigate } from "react-router-dom";
import Create_Appoinment from "./Create_Appoinment";
import { RiStickyNoteAddLine, RiUserSharedLine } from "react-icons/ri";
import TransferLeads from "./TransferLeads";
import axios from "axios";
import { API } from "../../../Constant";
import usePermission from "../../../hooks/UsePermissions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import NavBar from "../../../component/NavBar";

const Leads_Tab = ({ user }) => {
  const { searchTerm } = useSearch();
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("employee"));

  const { hasPermission } = usePermission(user);

  const canView = hasPermission("Leads", "View");
  const canEdit = hasPermission("Leads", "Edit");
  const canCreate = hasPermission("Leads", "Create");

  const [leads, setLeads] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [Edit_lead, setEdit_lead] = useState(false);
  const [CreateAppoinment, setCreateAppoinment] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [transferLeads, setTransferLeads] = useState(false);
  const [uniqueBDNames, setUniqueBDNames] = useState([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [filterParams, setFilterParams] = useState({
    fromdate: "",
    todate: "",
  });
  const itemsPerPage = 10;

  // ✅ Fetch leads
  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(`${API}/lead/getallleads`, {
        params: {
          role_name: employee.department,
          name: employee.name,
        },
      });

      setLeads(data.data);
      setFilteredData(data.data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ✅ Fetch BD Names
  useEffect(() => {
    const fetchBDNames = async () => {
      try {
        const response = await axios.get(`${API}/employee/getallemployees`);
        console.log(response);

        const usersArray = response.data.data;
        const bdNames = usersArray.map((user) => user.name);
        setUniqueBDNames([...bdNames]);
      } catch (error) {
        console.error("Failed to fetch BD users:", error);
      }
    };
    fetchBDNames();
  }, []);

  // ✅ Filter + search logic (like Tasks)
  const filteredLeads = leads
    .filter((lead) => {
      // 📅 Date filter
      if (!filterParams.fromdate && !filterParams.todate) return true;
      const created = new Date(lead.createdAt || lead.CreatedAt);
      if (filterParams.fromdate && created < new Date(filterParams.fromdate))
        return false;
      if (filterParams.todate && created > new Date(filterParams.todate))
        return false;
      return true;
    })
    .filter((lead) => {
      // 🔍 Search filter
      if (!searchTerm) return true;
      const lowerSearchTerm = searchTerm.toLowerCase();
      return Object.values(lead).some((value) =>
        value?.toString().toLowerCase().includes(lowerSearchTerm)
      );
    });

  const paginatedData = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterParams, searchTerm, leads]);

  // ✅ Select logic
  const handleSelectAll = () => {
    if (!selectAll) {
      const allIds = paginatedData.map((_, index) => index);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (rowIndex) => {
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowIndex));
    } else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };

  const handleTransferSave = () => {
    setSelectedRows([]);
    setSelectAll(false);
    setTransferLeads(false);
  };

  const exportLeadsToPDF = (leads) => {
    const doc = new jsPDF("landscape");

    doc.setFontSize(14);
    doc.text("Leads Report", 14, 15);

    const tableColumn = [
      "Lead ID",
      "Name",
      "Age",
      "Weight",
      "Circle",
      "Status",
      "BD Name",
    ];

    const tableRows = leads.map((lead) => [
      lead.lead_id,
      lead.name,
      lead.age,
      lead.weight,
      lead.circle,
      lead.status,
      lead.bdname || "Unassigned",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [33, 150, 243] },
    });

    doc.save("Leads_Report.pdf");
  };

  const exportLeadsToExcel = (leads) => {
    const worksheetData = leads.map((lead) => ({
      "Lead ID": lead.lead_id,
      Name: lead.name,
      Age: lead.age,
      Weight: lead.weight,
      Circle: lead.circle,
      Status: lead.status,
      "BD Name": lead.bdname || "Unassigned",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "Leads_Report.xlsx");
  };

  return (
    <>
      <NavBar title="Leads" pagetitle="Leads Table" />

      <div className="font-layout-font  flex justify-end items-center gap-2 pb-2">
        {canEdit && (
          <button
            onClick={() => selectedRows.length > 0 && setTransferLeads(true)}
            disabled={selectedRows.length === 0}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${
              selectedRows.length === 0
                ? "dark:bg-gray-500 bg-gray-400 text-white cursor-not-allowed"
                : "bg-select_layout-dark dark:text-white text-white cursor-pointer"
            }`}
          >
            <RiUserSharedLine size={18} />
            Transfer Leads
          </button>
        )}

        {/* {canCreate && (
            <p
              onClick={() => setCreateAppoinment(true)}
              className="cursor-pointer flex items-center text-white gap-2 bg-select_layout-dark px-4 py-2 text-sm rounded-md"
            >
              <RiStickyNoteAddLine size={18} />
              Create Appointment
            </p>
          )} */}

        <div className="relative">
          {/* Export Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExportOpen((prev) => !prev);
            }}
            className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md"
          >
            <TbFileExport />
            Export
          </button>

          {/* Dropdown */}
          {exportOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg z-50 bg-white dark:text-white text-black dark:bg-layout-dark border dark:border-gray-700">
              <button
                onClick={() => {
                  exportLeadsToPDF(filteredLeads);
                  setExportOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export PDF
              </button>

              <button
                onClick={() => {
                  exportLeadsToExcel(filteredLeads);
                  setExportOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export Excel
              </button>
            </div>
          )}
        </div>

        {/* ✅ Date Filter (same as Tasks) */}
        <div className="cursor-pointer flex items-center gap-3 dark:text-white dark:bg-layout-dark bg-layout-light rounded-md">
          <Filter onFilterChange={setFilterParams} />
        </div>
      </div>

      {/* ---------- Table ---------- */}
      <div className="font-layout-font overflow-auto no-scrollbar">
        <table className="w-full xl:h-fit h-[703px] dark:text-white whitespace-nowrap">
          <thead>
            <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
              <th className="p-4 rounded-l-lg">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4">S.no</th>
              {[
                "Lead ID",
                "Lead Type",
                "Name",
                "Age",
                "Weight",
                "Circle",
                "BD Name",
              ].map((heading) => (
                <th key={heading} className="p-5">
                  <h1 className="flex items-center justify-center gap-1">
                    {heading} <HiArrowsUpDown className="dark:text-white" />
                  </h1>
                </th>
              ))}
              <th className="pr-2 rounded-r-lg">Action</th>
            </tr>
          </thead>

          <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
            {paginatedData.length > 0 ? (
              paginatedData.map((data, index) => (
                <tr
                  key={data._id || index}
                  className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                >
                  <td className="rounded-l-lg">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={selectedRows.includes(index)}
                      onChange={() => handleRowSelect(index)}
                    />
                  </td>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{data.lead_id}</td>
                  <td className="first-letter:uppercase">{data.status}</td>
                  <td>{data.name}</td>
                  <td>{data.age}</td>
                  <td>{data.weight}</td>
                  <td>{data.circle}</td>
                  <td>{data.bdname || "Not yet Assigned"}</td>

                  <td className="space-x-2 pl-4 p-2.5 rounded-r-lg">
                    {canEdit && (
                      <button
                        onClick={() => {
                          setSelectedLead(data); // ✅ pass row data
                          setEdit_lead(true); // open modal
                        }}
                        className="cursor-pointer bg-blue-200 p-1.5 rounded-sm"
                      >
                        <Pencil size={16} className="text-blue-600" />
                      </button>
                    )}

                    {canView && (
                      <button
                        onClick={() =>
                          navigate("viewleads", { state: { lead: data } })
                        }
                        className="cursor-pointer bg-green-200 p-1.5 rounded-sm"
                      >
                        <LuEye size={16} className="text-green-600" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="text-center py-10 text-gray-500">
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredLeads.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {Edit_lead && (
        <Edit_leads
          onclose={() => setEdit_lead(false)}
          leadData={selectedLead} // ✅ send data
          fetchLeads={fetchLeads}
        />
      )}

      {CreateAppoinment && (
        <Create_Appoinment onclose={() => setCreateAppoinment(false)} />
      )}
      {transferLeads && (
        <TransferLeads
          onclose={() => setTransferLeads(false)}
          bdNames={uniqueBDNames}
          fetchLeads={fetchLeads}
          selectedLeads={selectedRows.map((index) => filteredLeads[index])}
          onSave={handleTransferSave}
        />
      )}
    </>
  );
};

export default Leads_Tab;
