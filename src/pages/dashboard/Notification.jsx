import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { API, formatDate } from "../../Constant";

const Notification = ({ onclose, employeeId, onUpdateUnread }) => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API}/notify/${employeeId}`);
      const data = res.data.data || [];
      setNotifications(data);

      if (onUpdateUnread) {
        const unreadCount = data.filter((n) => !n.read).length;
        onUpdateUnread(unreadCount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [employeeId]);

  // Mark one as read
  const markAsRead = async (_id) => {
    try {
      await axios.patch(`${API}/notify/read/${_id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === _id ? { ...n, read: true } : n))
      );

      if (onUpdateUnread) {
        const unreadCount = notifications.filter(
          (n) => n._id !== _id && !n.read
        ).length;
        onUpdateUnread(unreadCount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Mark all as read
  const markAllRead = async () => {
    try {
      await axios.patch(`${API}/notify/readall/${employeeId}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      if (onUpdateUnread) onUpdateUnread(0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = async (notificationId, actionType, relatedId, title) => {
    try {
      if (!relatedId) return alert("No related request found");

      let endpoint = "";

      // 🔹 Identify notification type based on title
      if (title?.toLowerCase().includes("wfh")) {
        endpoint = `${API}/wfh/respond/${relatedId}`;
      } else if (title?.toLowerCase().includes("leave")) {
        endpoint = `${API}/leave/respond/${relatedId}`;
      } else {
        return alert("Unknown notification type");
      }

      // 🔹 Call appropriate API (WFH or Leave)
      await axios.patch(endpoint, { action: actionType });

      // 🔹 Update UI instantly after action
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, read: true, actions: [] } // remove buttons
            : n
        )
      );

      if (onUpdateUnread) {
        const unreadCount = notifications.filter(
          (n) => n._id !== notificationId && !n.read
        ).length;
        onUpdateUnread(unreadCount);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update request");
    }
  };

  return (
    <div className="font-layout-font fixed inset-0 grid z-20 justify-end items-center backdrop-blur-xs">
      <div className="shadow-lg dark:bg-popup-gray p-6 bg-overall_bg-light dark:bg-overall_bg-dark rounded-lg drop-shadow-2xl w-[600px] h-screen relative">
        <div className="flex items-center justify-between mb-4 text-layout_text-light dark:text-layout_text-dark">
          <p className="text-center font-semibold text-2xl px-4 dark:text-white text-black">
            Notification
          </p>
          <div className="flex gap-2 items-center">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllRead}
                className="px-3 py-1 text-sm rounded bg-select_layout-dark text-white hover:bg-blue-600"
              >
                Mark All Read
              </button>
            )}
            <button onClick={onclose} className="dark:bg-popup-gray">
              <IoClose className="size-8" />
            </button>
          </div>
        </div>

        <div className="h-11/12 no-scrollbar overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`mb-3 px-4 dark:bg-layout-dark bg-layout-light p-4 rounded-2xl border-l-4 ${
                  n.read ? "border-gray-300" : "border-blue-500"
                } cursor-pointer`}
              >
                <div className="dark:text-white text-black pb-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button className="dark:bg-overall_bg-dark bg-overall_bg-light w-9 h-9 rounded-full flex items-center justify-center">
                      {n.title[0].toUpperCase()}
                    </button>
                    <p className="text-xl">{n.title}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(new Date(n.createdAt), "dd MMM yyyy")}
                  </p>
                </div>

                <div className="dark:text-white text-black pl-2 border-l-2">
                  <p className="text-md font-sans leading-snug mb-3">
                    {n.message}
                  </p>

                  {n.actions && n.actions.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {n.actions.includes("APPROVED") && (
                        <button
                          onClick={() =>
                            handleAction(
                              n._id,
                              "APPROVED",
                              n.relatedId,
                              n.title
                            )
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                      )}
                      {n.actions.includes("DECLINED") && (
                        <button
                          onClick={() =>
                            handleAction(
                              n._id,
                              "DECLINED",
                              n.relatedId,
                              n.title
                            )
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
              No notifications
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
