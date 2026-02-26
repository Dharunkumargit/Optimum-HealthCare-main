import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { API } from "../../../Constant";
import { toast } from "react-toastify";

const Edit_leads = ({ onclose, leadData, fetchLeads }) => {
  const [formData, setFormData] = useState({
    lead_id: "",
    name: "",
    phone: "",
    email: "",
    circle: "",
    status: "",
  });

  // ✅ Prefill data from table
  useEffect(() => {
    if (leadData) {
      setFormData({
        lead_id: leadData.lead_id || "",
        name: leadData.name || "",
        phone: leadData.phone || "",
        email: leadData.email || "",
        circle: leadData.circle || "",
        status: leadData.status || "",
      });
    }
  }, [leadData]);

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Save update
  const handleSave = async () => {
    try {
      await axios.put(`${API}/lead/updatelead/${leadData._id}`, formData);
      toast.success("Lead updated successfully");
      fetchLeads();
      onclose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    }
  };

  return (
    <div className="font-layout-font fixed inset-0 flex justify-center items-center backdrop-blur-sm z-10">
      <div className="dark:bg-layout-dark bg-layout-light rounded-lg drop-shadow-md dark:text-white w-fit h-fit">
        {/* Close */}
        <p
          className="grid place-self-end -mx-4 -my-4 dark:bg-layout-dark bg-layout-light shadow-sm py-2 px-2 rounded-full cursor-pointer"
          onClick={onclose}
        >
          <IoClose className="size-[20px]" />
        </p>

        <div className="grid justify-center px-8 py-4">
          <p className="text-center font-semibold text-lg">Edit Leads</p>

          <div className="p-4">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Lead ID */}
              <div className="flex col-span-2 justify-between items-center">
                <label className="font-medium">Leads ID</label>
                <input
                  type="text"
                  name="lead_id"
                  value={formData.lead_id}
                  disabled
                  className="p-2 rounded-md w-72 bg-transparent border border-gray-600"
                />
              </div>

              {/* Name */}
              <div className="flex col-span-2 justify-between items-center">
                <label className="font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-2 rounded-md w-72 bg-transparent border border-gray-600"
                />
              </div>

              {/* Phone */}
              <div className="flex col-span-2 justify-between items-center">
                <label className="font-medium">Phone number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-2 rounded-md w-72 bg-transparent border border-gray-600"
                />
              </div>

              {/* Email */}
              <div className="flex col-span-2 justify-between items-center">
                <label className="font-medium">Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 rounded-md w-72 bg-transparent border border-gray-600"
                />
              </div>

              {/* Location */}
              <div className="flex col-span-2 justify-between items-center">
                <label className="font-medium">Location</label>
                <input
                  type="text"
                  name="circle"
                  value={formData.circle}
                  onChange={handleChange}
                  className="p-2 rounded-md w-72 bg-transparent border border-gray-600"
                />
              </div>

              {/* Status */}
              <div className="flex col-span-2 justify-between items-center">
                <label className="font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="p-2 rounded-md w-72 bg-transparent  dark:bg-layout-dark border border-gray-600 dark:text-white "
                >
                  <option disabled value="" className="text-black">
                    select status
                  </option>
                  <option value="new">New</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-4 my-4 mx-6 text-sm">
          <p
            className="cursor-pointer border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
            onClick={onclose}
          >
            Cancel
          </p>
          <p
            onClick={handleSave}
            className="cursor-pointer bg-select_layout-dark text-white px-6 py-1.5 rounded-sm"
          >
            Save
          </p>
        </div>
      </div>
    </div>
  );
};

export default Edit_leads;
