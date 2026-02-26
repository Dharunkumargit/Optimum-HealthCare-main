import React, { useEffect, useState, useMemo } from "react";
import { HiArrowsUpDown } from "react-icons/hi2";
import Pagination from "../../../component/Pagination";
import { LuEye } from "react-icons/lu";
import { TbBrandCampaignmonitor, TbFileExport } from "react-icons/tb";
import Filter from "../../../component/Filter";
import CreateCampaign from "./CreateCampaign";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API, formatDate } from "../../../Constant";
import { useSearch } from "../../../component/SearchBar";
import usePermission from "../../../hooks/UsePermissions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import NavBar from "../../../component/NavBar";

const Campaign = ({ user }) => {
  const { searchTerm } = useSearch();
  const navigate = useNavigate();
  const { hasPermission } = usePermission(user);

  const canView = hasPermission("Campaigns", "View");
  const canCreate = hasPermission("Campaigns", "Create");
  const canExport = hasPermission("Campaigns", "Download");
  const [exportOpen, setExportOpen] = useState(false);

  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [createCampaign, setCreateCampaign] = useState(false);
  const [filterParams, setFilterParams] = useState({
    fromdate: "",
    todate: "",
  });

  const itemsPerPage = 10;

  // ✅ Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API}/campaign/allcampaigns`);
      setCampaigns(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch campaigns");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [createCampaign]);

  // ✅ Filter + Search Logic
  const filteredData = useMemo(() => {
    return campaigns
      .filter((camp) => {
        // Date filtering
        if (!filterParams.fromdate && !filterParams.todate) return true;
        const start = new Date(camp.startDate);
        if (filterParams.fromdate && start < new Date(filterParams.fromdate))
          return false;
        if (filterParams.todate && start > new Date(filterParams.todate))
          return false;
        return true;
      })
      .filter((camp) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          camp.campaign_id?.toLowerCase().includes(term) ||
          camp.channel?.toLowerCase().includes(term)
        );
      });
  }, [campaigns, filterParams, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterParams, searchTerm]);

  const exportToPDF = () => {
    const doc = new jsPDF("l", "mm", "a4"); // landscape

    doc.setFontSize(14);
    doc.text("Campaign Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [
        [
          "S.No",
          "Campaign ID",
          "Channel",
          "Start Date",
          "End Date",
          "Budget",
          "Leads",
          "CPL",
        ],
      ],
      body: filteredData.map((camp, index) => [
        index + 1,
        camp.campaign_id,
        camp.channel,
        formatDate(camp.startDate),
        formatDate(camp.endDate),
        camp.budget,
        camp.leads ? camp.leads.length : 0,
        camp.leads && camp.leads.length > 0
          ? (camp.budget / camp.leads.length).toFixed(2)
          : "0.00",
      ]),
      headStyles: {
        fillColor: [30, 64, 175], // dark blue
        textColor: 255,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    doc.save("Campaign_Report.pdf");
  };

  const exportToExcel = () => {
    const excelData = filteredData.map((camp, index) => ({
      "S.No": index + 1,
      "Campaign ID": camp.campaign_id,
      Channel: camp.channel,
      "Start Date": formatDate(camp.startDate),
      "End Date": formatDate(camp.endDate),
      Budget: camp.budget,
      Leads: camp.leads ? camp.leads.length : 0,
      CPL:
        camp.leads && camp.leads.length > 0
          ? (camp.budget / camp.leads.length).toFixed(2)
          : "0.00",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campaigns");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "Campaign_Report.xlsx");
  };

  return (
    <>
      <NavBar
      title="Campaigns"
      pagetitle="Campaign Table"
      />
     
        <div className="font-layout-font flex justify-end items-center gap-2 pb-2">
          {canCreate && (
            <p
              onClick={() => setCreateCampaign(true)}
              className="cursor-pointer flex items-center dark:text-white gap-2 bg-select_layout-dark px-4 py-2 text-sm rounded-md"
            >
              <TbBrandCampaignmonitor size={18} />
              Create Campaign
            </p>
          )}

          {canExport && (
            <div className="relative">
              {/* Export Button */}
              <button
                onClick={() => setExportOpen((prev) => !prev)}
                className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md"
              >
                <TbFileExport />
                Export
              </button>

              {/* Dropdown */}
              {exportOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg z-50 dark:bg-layout-dark dark:text-white text-black bg-white border dark:border-gray-700">
                  <button
                    onClick={() => {
                      exportToPDF();
                      setExportOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Export PDF
                  </button>

                  <button
                    onClick={() => {
                      exportToExcel();
                      setExportOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Export Excel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ✅ Simple Date Filter */}
          <div className="cursor-pointer flex items-center gap-3 dark:text-white dark:bg-layout-dark bg-layout-light rounded-md">
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
                "Campaign ID",
                "Campaign Name",
                "Channel",
                "Start Date",
                "End Date",
                "Budget",
                "Leads",
                "CPL",
              ].map((heading) => (
                <th key={heading} className="p-5">
                  <h1 className="flex items-center justify-center gap-1">
                    {heading} <HiArrowsUpDown className="dark:text-white" />
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
                  className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                  key={data._id}
                >
                  <td className="rounded-l-lg p-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>{data.campaign_id}</td>
                  <td>{data.channelName}</td>
                  <td>{data.channel}</td>
                  <td>{formatDate(data.startDate)}</td>
                  <td>{formatDate(data.endDate)}</td>
                  <td>{data.budget}</td>
                  <td>{data.leads ? data.leads.length : 0}</td>
                  <td>
                    {data.leads && data.leads.length > 0
                      ? (data.budget / data.leads.length).toFixed(2)
                      : "0.00"}
                  </td>

                  {canView && (
                    <td className="pl-4 p-2.5 rounded-r-lg">
                      <p
                        onClick={() =>
                          navigate(`viewcampaign`, {
                            state: { id: data._id, campid: data.campaign_id },
                          })
                        }
                        className="cursor-pointer bg-[#BAFFBA] text-green-600 w-fit rounded-sm py-1.5 px-1.5"
                      >
                        <LuEye size={16} />
                      </p>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={canView ? 9 : 8}
                  className="text-center py-10 text-gray-500"
                >
                  No matching results found.
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

      {createCampaign && (
        <CreateCampaign onclose={() => setCreateCampaign(false)} />
      )}
    </>
  );
};

export default Campaign;
