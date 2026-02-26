import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { GoBell } from "react-icons/go";
import { IoMdMenu } from "react-icons/io";
import ThemeToggle from "../../component/ThemeToggle";
import Title from "../../component/Title";
import Logo_L from "../../assets/images/Logo(light).png";
import Logo_D from "../../assets/images/Logo(dark).png";
import { API } from "../../Constant";

const Header = ({ open, setOpen, employeeId }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/notification/${employeeId}`);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchNotifications();
  }, [employeeId]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  // ✅ Optional: Mark a notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`${API}/notification/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "read" } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  return (
    <div className="flex justify-between py-2 mb-4 items-center relative">
      {/* Title */}
      <div className="hidden sm:block">
        <Title title={"Dashboard"} sub_title={"Main Dashboard"} />
      </div>

      <div className="flex items-center w-screen sm:w-auto justify-between">
        {/* Mobile Menu */}
        <div className="sm:hidden flex gap-4 items-center">
          <IoMdMenu
            className="text-2xl text-layout_text-light dark:text-layout_text-dark"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <>
              <img src={Logo_L} alt="logo" className="w-36 dark:hidden -ml-6" />
              <img
                src={Logo_D}
                alt="logo"
                className="hidden w-36 dark:block -ml-6"
              />
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="bg-layout-light dark:bg-layout-dark flex rounded-4xl px-3 py-2 justify-between items-center relative">
          <div className="flex">
            {/* Search */}
            <div className="md:flex hidden justify-center gap-2 items-center p-1 rounded-full outline-none bg-overall_bg-light dark:bg-overall_bg-dark">
              <CiSearch
                size={20}
                className="text-header_icons-light dark:text-header_icons-dark "
              />
              <input
                type="text"
                name="search"
                placeholder="search"
                id="search"
                className="placeholder:text-header_icons-light dark:placeholder:text-header_icons-dark text-header_icons-light dark:text-header_icons-dark w-36 bg-transparent outline-none"
              />
            </div>

            {/* Notification Bell */}
            <div
              className="relative md:flex justify-center items-center bg-overall_bg-light dark:bg-overall_bg-dark rounded-full mx-2 p-2 px-2.5 cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-black"></span>
              )}
              <GoBell className="size-5 text-header_icons-light dark:text-header_icons-dark" />
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-12 right-16 w-80 bg-white dark:bg-layout-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 font-semibold border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100">
                  Notifications
                </div>

                {loading ? (
                  <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                ) : notifications.length > 0 ? (
                  <ul className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n._id}
                        onClick={() => handleMarkAsRead(n._id)}
                        className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                          n.status === "unread" ? "bg-gray-100 dark:bg-gray-900" : ""
                        }`}
                      >
                        <p className="text-sm font-medium">{n.type.toUpperCase()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                )}

                <div
                  className="p-2 text-center text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  onClick={() => console.log("View All clicked")}
                >
                  View All
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex text-header_icons-light dark:text-header_icons-dark font-layout-font justify-center items-center gap-2">
            <p className="hidden lg:block font-layout-font">Profile name</p>
            <p className="bg-overall_bg-light dark:text-header_icons-dark text-header_icons-light dark:bg-overall_bg-dark rounded-full p-2 px-2.5">
              KA
            </p>
          </div>

          <span className="pl-2">
            <ThemeToggle />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
