import React, { use, useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import { HiArrowsUpDown } from "react-icons/hi2";
import { FiTrash2 } from "react-icons/fi";
import DeleteModal from "../../../component/DeleteModal";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";
import { useNavigate } from "react-router-dom";

const LeadsTable = ({ data }) => {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate(); 
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Sync local leads state with parent data
  useEffect(() => {
    setLeads(data || []);
  }, [data]);

  // ✅ Delete lead
  const handleDelete = async (leadId) => {
    try {
      await axios.delete(`${API}/lead/${leadId}`);
      setLeads(leads.filter((lead) => lead._id !== leadId));
      setDeleteModal(false);
      toast.success("Lead deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lead");
    }
  };

  return (
    <>
      {leads.length > 0 ? (
        <div className="font-layout-font overflow-auto no-scrollbar h-48">
          <table className="w-full dark:text-white whitespace-nowrap">
            <thead>
              <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
                <th className="p-3 rounded-l-lg">S.no</th>
                {[
                  "Name",
                  "Contact Number",
                  "Email",
                  "Source",
                  "Lead Status",
                  "Notes",
                  "Assigned Consultant",
                ].map((heading) => (
                  <th key={heading} className="p-2">
                    <h1 className="flex items-center justify-center gap-1">
                      {heading} <HiArrowsUpDown className="dark:text-white" />
                    </h1>
                  </th>
                ))}
                <th className="pr-2 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
              {leads.map((lead, index) => (
                <tr
                  key={lead._id}
                  className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                >
                  <td className="rounded-l-lg">{index + 1}</td>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.email}</td>
                  <td>{lead.source}</td>
                  <td className="first-letter:uppercase">
                    <span
                      className={` 
                        font-semibold
                        ${lead.status === "new" ? "text-purple-400" : ""}
                        ${lead.status === "follow-up" ? "text-yellow-400" : ""}
                        ${lead.status === "converted" ? "text-green-600" : ""}
                        ${lead.status === "lost" ? "text-red-500" : ""}
                      `}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.notes}</td>
                  <td>{lead.consultant}</td>
                  <td className="pl-4 p-2.5 rounded-r-lg">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => {
                     navigate("/leads")
                        }}
                        className="cursor-pointer p-1 rounded-sm bg-green-200 text-green-600"
                      >
                        <LuEye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setDeleteModal(true);
                        }}
                        className="cursor-pointer p-1 rounded-sm bg-red-200 text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dark:bg-layout-dark bg-layout-light text-red-500 text-center py-4 font-semibold text-lg -mt-2 rounded-lg">
          <p>No Data Available !!!</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && selectedLead && (
        <DeleteModal
          onclose={() => setDeleteModal(false)}
          title="Lead"
          onConfirm={() => handleDelete(selectedLead._id)}
        />
      )}

      {/* View Lead Modal */}
      {/* {viewModal && selectedLead && (
        <ViewLeadModal
          onclose={() => setViewModal(false)}
          lead={selectedLead}
        />
      )} */}
    </>
  );
};

export default LeadsTable;
