import React, { useEffect, useState } from "react";
import NavBar from "../../../component/NavBar";
import { MdModeEdit } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { IoChevronBackSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import AddFollowUp from "./AddFollowUp";
import profile from "../../../assets/images/profile.jpg";
import EditLeadDetails from "./EditLeadDetails";
import MultiDocuments from "./MultiDocuments";
import { UserPlus } from "lucide-react";
import { RiStickyNoteAddLine } from "react-icons/ri";
import Create_Appointment from "./Create_Appoinment";
import axios from "axios";
import { API } from "../../../Constant";

const formatDateReadable = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const formatRelativeTime = (date) => {
  if (!date) return "-";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (let unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value >= 1) {
      return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

const ViewLeads = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lead } = location.state || {};

  const [addFollowUp, setAddFollowUp] = useState(false);
  const [multidocuments, setMultidocuments] = useState(false);
  const [editLeadsDetails, setEditLeadsDetails] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [previewImage, setPreviewImage] = useState(null); // <-- Modal state

  // Fetch follow-ups
  const fetchFollowUp = async () => {
    try {
      const response = await axios.get(`${API}/lead/getfollowup/${lead.lead_id}`);
      setFollowUps(response.data.data);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    }
  };

  useEffect(() => {
    fetchFollowUp();
  }, []);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API}/lead/${lead.lead_id}/documents`);
      setDocuments(response.data.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fields for lead details
  const fields = [
    { label: "Lead ID", value: lead.lead_id },
    { label: "Name", value: lead.name },
    { label: "Age", value: lead.age },
    { label: "Weight", value: lead.weight },
    { label: "Circle", value: lead.circle },
    { label: "BD Name", value: lead.bdname || "—" },
    { label: "Comments", value: lead.notes },
    { label: "Status", value: lead.status },
    {
      label: "Created Date",
      value: `${new Date(lead.createdAt).toLocaleDateString("en-GB")} (${formatRelativeTime(lead.createdAt)})`,
    },
  ];

  return (
    <>
      <NavBar title="Leads" pagetitle="View Leads" />

      <div className="font-layout-font mb-3 overflow-auto no-scrollbar">
        <div className="flex justify-end my-2 gap-2 ">
          <button onClick={() => setAppointmentModal(true)} className="font-normal flex items-center gap-2 text-sm bg-select_layout-dark rounded-md text-white px-6 py-2.5">
            <RiStickyNoteAddLine size={18} /> Add Appointment
          </button>
          <button onClick={() => setMultidocuments(true)} className="font-normal flex items-center gap-2 text-sm bg-select_layout-dark rounded-md text-white px-6 py-2.5">
            <FaRegFileAlt size={20} /> Add Documents
          </button>
          <button onClick={() => setAddFollowUp(true)} className="font-normal flex items-center gap-2 text-sm bg-select_layout-dark rounded-md text-white px-6 py-2.5">
            <UserPlus size={20} /> Add FollowUp
          </button>
        </div>

        {/* Lead Profile & Details */}
        <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-1 grid-cols-1 my-4">
          <div className="dark:bg-[#454545] bg-purple-100 rounded-md drop-shadow-lg">
            <div className="flex justify-between h-48"></div>
            <div className="dark:bg-layout-dark bg-layout-light flex justify-between items-center rounded-b-md p-4">
              <div className="mx-2 py-6">
                <span className="drop-shadow-md shadow-lg grid -mt-22 text-white font-semibold text-4xl bg-overall_bg-dark rounded-full w-24 h-24 items-center justify-center ">
                  <img src={profile} alt="img" className="w-30 rounded-full h-24" />
                </span>
                <p className="mt-4 mx-3 dark:text-white font-semibold">{lead.name}</p>
                <p className="my-1 mx-3 dark:text-gray-200 font-extralight">{lead.phone}</p>
              </div>
              <div className="grid -mt-36 mx-2 my-2">
                <button className="flex items-center gap-1 px-4 bg-blue-200 text-blue-400 rounded-sm py-2" onClick={() => setEditLeadsDetails(true)}>
                  <MdModeEdit />
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* FOLLOW UPS */}
          <div className="dark:bg-layout-dark bg-layout-light dark:text-white px-8 py-6 rounded-md drop-shadow-lg">
            <p className="font-semibold">Follow Up</p>
            <div className="mt-4 space-y-6 overflow-y-auto h-64 no-scrollbar pr-2">
              {followUps.length > 0 ? (
                followUps.map((follow, index) => (
                  <div key={index} className="">
                    <p className="font-semibold flex gap-4 items-center">
                      <span className="bg-blue-200 text-blue-400 px-2 py-2 rounded">
                        <FaRegFileAlt />
                      </span>
                      Next Follow up Date on: {new Date(follow.follow_up_date).toLocaleDateString("en-GB")}
                    </p>
                    <p className="text-xs mx-12 dark:text-gray-400 font-extralight">Note</p>
                    <p className="text-sm mx-12 font-extralight dark:text-gray-50">{follow.notes || "—"}</p>
                    <p className="text-sm mx-12 font-medium dark:text-gray-50">
                      {follow.createdBy || "System"}, {new Date(follow.createdAt).toLocaleDateString("en-GB")}, {new Date(follow.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No follow-ups added yet</p>
              )}
            </div>
          </div>

          {/* Lead Details */}
          <div className="grid text-sm dark:bg-layout-dark bg-layout-light dark:text-white rounded-md drop-shadow-lg px-8 py-8 gap-2">
            <p className="mb-3 font-semibold">Leads Details</p>
            {fields.map((item, idx) => (
              <div key={idx} className="grid grid-cols-8 items-center">
                <span className="col-span-4 font-medium">{item.label}</span>
                <span className="col-span-4 text-end text-gray-600 dark:text-gray-200">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Added Documents with Modal Preview */}
          <div className="text-sm dark:bg-layout-dark bg-layout-light dark:text-white   rounded-md drop-shadow-lg px-8 py-8">
            <p className="font-semibold">Added Documents</p>

            {documents?.length > 0 ? (
              <div className="mt-4 space-y-2 h-96  overflow-y-auto no-scrollbar">
                {documents.map((doc, index) => {
                  const isImage = doc.fileType?.startsWith("image/");

                  return (
                    <div key={index} className="flex justify-between items-center px-3 py-1.5 ">
                      <span className="truncate max-w-[80%]">{doc.fileName}</span>

                      {isImage ? (
                        <button
                          onClick={() => setPreviewImage(doc.fileUrl)}
                          className="px-3 py-1 text-xs bg-primary text-blue-700 rounded-md hover:opacity-90"
                        >
                          View
                        </button>
                      ) : (
                        <a
                          href={doc.fileUrl}
                          download
                          className="py-1  text-xs bg-primary text-blue-700 rounded-md hover:opacity-90"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-2">No documents added</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-8 relative">
        <p
          onClick={() => navigate("/leads")}
          className="cursor-pointer text-lg dark:text-white absolute flex items-center gap-2 bg-select_layout-dark rounded-sm py-1.5 px-8 -bottom-10 right-0"
        >
          <IoChevronBackSharp /> back
        </p>
      </div>

      {/* Modal Preview */}
      {previewImage && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            <img src={previewImage} alt="Preview" className="max-h-[80vh] max-w-[90vw] rounded-md" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded hover:bg-opacity-80"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modals for Add/Edit */}
      {addFollowUp && <AddFollowUp onclose={() => setAddFollowUp(false)} selectedLead={lead} onsuccess={fetchFollowUp} />}
      {multidocuments && <MultiDocuments onclose={() => setMultidocuments(false)} lead={lead} onsucess={fetchDocuments} />}
      {editLeadsDetails && <EditLeadDetails onclose={() => setEditLeadsDetails(false)} />}
      {appointmentModal && <Create_Appointment onclose={() => setAppointmentModal(false)} lead={lead} />}
    </>
  );
};

export default ViewLeads;
