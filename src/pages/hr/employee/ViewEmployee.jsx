import React, { useState, useEffect } from "react";
import { IoClose, IoEye, IoDownload, IoMail, IoCalendar, IoCard, IoPeople } from "react-icons/io5";
import axios from "axios";
import { API } from "../../../Constant";

const ViewEmployee = ({ onclose, employeeId, employees }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) fetchEmployee();
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/employee/getemployee/${employeeId}`);
      setEmployee(res.data.data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileUrl, fileName) => {
    try {
      console.log("📥 Downloading:", fileUrl);
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
        timeout: 30000
      });
      
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType || 'application/pdf' });
      const finalName = fileName || 'document.pdf';
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = finalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Download failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto animate-spin mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
  const formatCurrency = (amount) => amount ? `₹${Number(amount).toLocaleString()}` : "N/A";
  const reportingPerson = employees?.find(emp => emp._id === employee.rpperson)?.name || "N/A";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-layout-dark dark:text-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{employee.name}</h1>
            <button onClick={onclose} className="p-2 hover:bg-gray-100 rounded">
              <IoClose className="text-xl text-gray-500" />
            </button>
          </div>
          <div className="flex flex-wrap  items-center gap-3 text-sm">
            <span className="font-semibold">{employee.employee_id}</span>
            {/* <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{employee.department}</span> */}
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">{employee.status}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 block">Father's Name</span>
              <span className="font-semibold">{employee.fatherName}</span>
            </div>
            <div>
              <span className="text-gray-600 block">DOB</span>
              <span className="font-semibold">{formatDate(employee.dob)}</span>
            </div>
       
            <div className="col-span-2">
              <span className="text-gray-600 block">Address</span>
              <span>{employee.address}</span>
            </div>
          </div>

          {/* Professional */}
          <div className="p-4 bg-gray-50 dark:bg-layout-dark dark:text-white rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <IoCalendar className="text-emerald-500" />
              <span className="font-semibold text-lg">Professional</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 block">Job Title</span>
                <span className="font-semibold">{employee.jobTitle}</span>
              </div>
              <div>
                <span className="text-gray-600 block">DOJ</span>
                <span className="font-semibold">{formatDate(employee.dateOfJoining)}</span>
              </div>
              <div>
                <span className="text-gray-600 block">CTC</span>
                <span className="font-bold text-emerald-600 text-lg">{formatCurrency(employee.ctc)}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Leave</span>
                <span className="font-bold text-blue-600">{employee.leaveBalance || 0} days</span>
              </div>
            </div>
          </div>

          {/* Bank Account */}
          <div className="p-6  rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <IoCard className="text-purple-500 text-xl" />
              <span className="font-bold text-xl">Bank Account</span>
            </div>
            <div className="p-4 rounded-lg border-2 shadow-sm text-center">
              <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                {employee.bankAccount || "N/A"}
              </p>
            </div>
          </div>

          {/* Reporting */}
          <div className="p-4 bg-gray-50  dark:bg-layout-dark rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <IoPeople className="text-indigo-500" />
              <span className="font-semibold text-lg">Reporting</span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600 text-sm block">Reporting Person</span>
                <span className="font-bold text-lg">{reportingPerson}</span>
              </div>
              {employee.lastIncrementDate && (
                <div className="flex gap-4 text-sm">
                  <span>Last Increment: {formatDate(employee.lastIncrementDate)}</span>
                  <span className="font-bold text-emerald-600">CTC: {formatCurrency(employee.lastIncrementCtc)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          {(employee.aadhaar || employee.healthInsuranceFile) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <IoDownload className="text-emerald-500" />
                <span className="font-semibold text-lg">Documents</span>
              </div>
              
              {employee.aadhaar && (
                <div className="p-4 bg-blue-50  dark:bg-layout-dark rounded-lg border flex items-center justify-between">
                  <div>
                    <span className="font-semibold">Aadhaar Card</span>
                    <span className="text-sm text-gray-600 block">{employee.aadhaarFileName}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(employee.aadhaar, '_blank')}
                      className="p-2 border rounded hover:bg-white flex items-center gap-1 text-sm"
                      title="View"
                    >
                      <IoEye />
                    </button>
                    <button
                      onClick={() => downloadFile(employee.aadhaar, employee.aadhaarFileName)}
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded flex items-center gap-1 text-sm shadow"
                      title="Download"
                    >
                      <IoDownload />
                    </button>
                  </div>
                </div>
              )}
              
              {employee.healthInsuranceFile && (
                <div className="p-4 bg-green-50 dark:bg-layout-dark rounded-lg border flex items-center justify-between">
                  <div>
                    <span className="font-semibold">Health Insurance</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(employee.healthInsuranceFile, '_blank')}
                      className="p-2 border rounded hover:bg-white flex items-center gap-1 text-sm"
                    >
                      <IoEye />
                    </button>
                    <button
                      onClick={() => downloadFile(employee.healthInsuranceFile, employee.healthInsuranceFileName)}
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded flex items-center gap-1 text-sm shadow"
                    >
                      <IoDownload />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t dark:bg-layout-dark bg-gray-50 text-right">
          <button
            onClick={onclose}
            className="px-8 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
