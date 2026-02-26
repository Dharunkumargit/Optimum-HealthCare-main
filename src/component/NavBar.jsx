import React, { useState, useEffect, useRef } from "react";
import { Search, Bell } from "lucide-react";
import { useSearch } from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import Notification from "../pages/dashboard/Notification";
import axios from "axios";
import { API } from "../Constant";


const NavBar = ({ pagetitle, title }) => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useSearch();
  const dropdownRef = useRef(null);

  // Logged-in employee
  const user = JSON.parse(localStorage.getItem("employee")) || {};
  const employee_id = user.employee_id;
  const employeeName = user.name || "User";
  const employeeInitials = employeeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Notification state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count
  const fetchUnreadCount = async () => {
    if (!employee_id) return;
    try {
      const res = await axios.get(`${API}/notify/${employee_id}`);
      const notifications = res.data.data || [];
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Optional: poll every 30s to update badge
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [employee_id]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative ">
        <div className="font-layout-font flex-wrap flex justify-between items-center text-sm my-1.5 dark:text-white overflow-auto no-scrollbar">
          {/* Page Title */}
          <div className="mx-2 space-y-1">
            <div className="flex gap-1 font-normal text-base">
              <p>{title}</p>/<p>{pagetitle}</p>
            </div>
            <p className="font-bold text-lg my-1">{pagetitle}</p>
          </div>

          {/* Right-side controls */}
          <div className="flex justify-center lg:p-2 md:p-2 p-1.5 lg:gap-2 md:gap-2 gap-1.5 bg-layout-light dark:bg-layout-dark items-center text-center dark:text-white rounded-full">
            {/* Search */}
            <p className="lg:mx-1 md:mx-1 mx-0 flex lg:gap-2 md:gap-2 gap-1.5 rounded-full items-center lg:p-2 md:p-2 p-1.5 dark:bg-overall_bg-dark bg-overall_bg-light">
              <Search className="size-5" />
              <input
                type="text"
                className="w-48 outline-0"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </p>

            {/* Notification Bell */}
            <div className="relative cursor-pointer dark:bg-overall_bg-dark bg-overall_bg-light lg:p-2 md:p-2 p-1.5 rounded-full">
              <Bell
                className="size-5"
                onClick={() => setNotificationOpen(!notificationOpen)}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 text-xs text-nowrap">
              {employeeName}
              <span>
                <div>
                  <button
                    className="dark:bg-overall_bg-dark bg-overall_bg-light w-9 h-9 rounded-full flex items-center justify-center"
                    onClick={() => navigate("/dashboard/profile")}
                  >
                    {employeeInitials}
                  </button>
                </div>
              </span>
            </div>

            {/* Theme toggle */}
            <div className="pb-0.5">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {notificationOpen && (
        <Notification
          onclose={() => {
            setNotificationOpen(false);

            fetchUnreadCount(); // update badge after closing
          }}
          onUpdateUnread={(count) => setUnreadCount(count)}
          employeeId={employee_id}
        />
      )}
    </>
  );
};

export default NavBar;
