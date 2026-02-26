import React, { useState, useEffect } from "react";
import { ClipboardPenLine } from "lucide-react";
import axios from "axios";
import { API } from "../../../../Constant";
import Apply_Leave from "../Apply_Leave";
import Apply_WFH from "../Apply_WFH";

const WFH_Leave = ({ employeeId, reportingPerson, role }) => {
  const [activeTab, setActiveTab] = useState("leave");
  const [applyModal, setApplyModal] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [wfhData, setWfhData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Common Fetch Function
  const fetchData = async () => {
    try {
      setLoading(true);
      let leaveRes, wfhRes;

      if (role === "admin") {
        leaveRes = await axios.get(`${API}/leave/reporting/${employeeId}`);
        wfhRes = await axios.get(`${API}/wfh/reporting/${employeeId}`);
      } else {
        leaveRes = await axios.get(`${API}/leave/${employeeId}`);
        wfhRes = await axios.get(`${API}/wfh/${employeeId}`);
      }

      setLeaveData(leaveRes.data || []);
      setWfhData(wfhRes.data.data || []);
    } catch (error) {
      console.error("Error fetching leave/WFH data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, employeeId, role]);

  const currentData = activeTab === "leave" ? leaveData : wfhData;

  return (
    <div>
      <div className="justify-between items-center flex m-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("leave")}
            className={`px-4 py-2 rounded-md font-medium cursor-pointer ${
              activeTab === "leave"
                ? "dark:bg-black/30 bg-overall_bg-light dark:text-white text-black"
                : " text-gray-600 dark:text-gray-300"
            }`}
          >
            Leaves
          </button>
          <button
            onClick={() => setActiveTab("wfh")}
            className={`px-4 py-2 rounded-md font-medium cursor-pointer ${
              activeTab === "wfh"
                ? "dark:bg-black/30 bg-overall_bg-light dark:text-white text-black"
                : " text-gray-600 dark:text-gray-300"
            }`}
          >
            WFH
          </button>
        </div>

        {/* Show Apply button only for employees */}
        {role !== "admin" && (
          <p
            onClick={() => setApplyModal(true)}
            className="cursor-pointer w-fit flex items-center text-white gap-2 bg-select_layout-dark px-4 py-2 text-sm rounded-md"
          >
            <ClipboardPenLine size={18} />
            {activeTab === "leave" ? "Apply Leave" : "Apply WFH"}
          </p>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="dark:bg-overall_bg-dark bg-overall_bg-light border-b-2 pb-2 dark:border-layout-dark border-layout-light">
                <th className="px-2 py-3 rounded-l-md">S.No</th>
                {/* 👇 Show Employee column only for Admin or Reporting Person */}
                {role === "admin" && <th className="p-2">Employee</th>}
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Type</th>
                <th className="p-2">Reason</th>
                <th className="p-2 rounded-r-md">Status</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, idx) => (
                  <tr
                    key={item._id}
                    className="dark:bg-overall_bg-dark bg-overall_bg-light border-b-2 dark:border-layout-dark border-layout-light rounded-lg text-center"
                  >
                    <td className="px-2 py-3 text-sm rounded-l-md">
                      {idx + 1}
                    </td>

                    {/* 👇 Only show Employee name if Admin or Reporting */}
                    {role === "admin" && (
                      <td className="p-2">
                        {item.employeeName || item.employee_id}
                      </td>
                    )}

                    <td className="p-2">
                      {new Date(item.fromDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {new Date(item.toDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {activeTab === "leave" ? item.leaveType : "WFH"}
                    </td>
                    <td className="p-2">{item.reason}</td>
                    <td className="p-2 text-sm w-32 px-5 items-center rounded-r-md">
                      <p
                        className={`border w-28 font-medium rounded-md py-1 ${
                          item.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : item.status === "DECLINED"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={role === "admin" ? 7 : 6}
                    className="text-center text-gray-500 py-6 dark:text-gray-400"
                  >
                    No {activeTab === "leave" ? "Leave" : "WFH"} records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply Modal */}
      {applyModal &&
        (activeTab === "leave" ? (
          <Apply_Leave
            onclose={() => setApplyModal(false)}
            employeeId={employeeId}
            reportingPerson={reportingPerson}
            onSuccess={fetchData}
          />
        ) : (
          <Apply_WFH
            onclose={() => setApplyModal(false)}
            employeeId={employeeId}
            reportingPerson={reportingPerson}
            onSuccess={fetchData}
          />
        ))}
    </div>
  );
};

export default WFH_Leave;
