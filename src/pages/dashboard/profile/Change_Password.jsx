import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";

const Change_Password = ({ onclose, employeeId }) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPass || !newPass) return toast.error("All fields are required");

    try {
      setLoading(true);
      const res = await axios.put(`${API}/employee/changepassword`, {
        employee_id: employeeId,
        oldPassword: oldPass,
        newPassword: newPass,
      });

      toast.success("Password Changed successfully");
      onclose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-layout-font fixed inset-0 grid z-20 justify-center items-center backdrop-blur-xs">
      <div className="mx-2 p-4 text-white shadow-lg dark:bg-popup-gray bg-layout-light dark:bg-layout-dark rounded-lg drop-shadow-2xl lg:w-[500px] md:w-[500px] w-96 relative">
        <button
          onClick={onclose}
          className="absolute top-0 right-0 p-2 rounded-full"
        >
          <IoClose className="size-[24px]" />
        </button>
        <h1 className="text-center font-semibold text-xl py-2 mb-4 dark:text-white text-black">
          Change Password
        </h1>
        <div className="grid gap-4">
          {/* Old Password */}
          <div className="grid grid-cols-2 items-center relative">
            <p>Old Password</p>
            <div className="relative w-full">
              <input
                type={showOld ? "text" : "password"}
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="outline-none w-full p-2 rounded-md border border-gray-600 bg-transparent dark:text-white text-black pr-10"
              />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div className="grid grid-cols-2 items-center relative">
            <p>New Password</p>
            <div className="relative w-full">
              <input
                type={showNew ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="outline-none w-full p-2 rounded-md border border-gray-600 bg-transparent dark:text-white text-black pr-10"
              />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs text-black dark:text-white">
            <p className="font-medium">
              Important note <span className="text-red-700">*</span>
            </p>
            <p>
              Password must contain at least one capital letter, one small
              letter, one number, one special character, and minimum 9
              characters.
            </p>
            <p className="font-medium">Example: Pass@2020</p>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onclose}
              className="border border-select_layout-dark px-6 py-1.5 rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              className={`px-6 py-1.5 rounded-sm text-white ${
                loading ? "bg-gray-400" : "bg-select_layout-dark"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Change_Password;
