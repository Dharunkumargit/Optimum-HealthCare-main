import React from "react";
import { IoClose } from "react-icons/io5";

const EditLeadDetails = ({ onclose }) => {
  return (
    <div className="font-layout-font fixed inset-0 grid z-20 justify-center items-center backdrop-blur-xs">
      <div className="mx-2 p-4 shadow-lg dark:bg-popup-gray bg-layout-light dark:bg-layout-dark rounded-lg drop-shadow-2xl lg:w-[600px] md:w-[600px] w-96 relative">
        <div className="grid p-4 text-layout_text-light dark:text-layout_text-dark">
          <button
            onClick={onclose}
            className="place-self-end dark:bg-popup-gray bg-white dark:bg-layout-dark absolute rounded-full -top-5 -right-4 lg:shadow-md md:shadow-md shadow-none lg:py-3 md:py-3 py-0 lg:px-3 md:px-3 px-0"
          >
            <IoClose className="size-[24px]" />
          </button>

          <h1 className="text-center font-semibold text-xl py-2 mb-4 dark:text-white text-black">
            Edit Lead Details
          </h1>

          <form className="grid grid-cols-1 sm:grid-cols-2 space-y-2 gap-4 dark:text-white text-black">
            {/* Channel */}

            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="font-medium">Leads ID</label>
              <input
                type="text"
                placeholder="#5473"
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
              />
            </div>

            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="font-medium">Email ID</label>
              <input
                type="email"
                placeholder="ravikumar@gmail.com"
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
              />
            </div>

            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="font-medium">Status</label>
              <select className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:text-white ">
                <option value="Active" className="text-black">
                  Follow up
                </option>
                <option value="Pending" className="text-black">
                  Pending
                </option>
                <option value="On Hold" className="text-black">
                  On Hold
                </option>
                <option value="Inactive" className="text-black">
                  Inactive
                </option>
                <option value="Closed" className="text-black">
                  Closed
                </option>
              </select>
            </div>

            {/* <div className="flex col-span-2 gap-5 justify-between items-center ">
              <label className="font-medium">Assign to Sales Person</label>
              <input
                type="text"
                placeholder="Name"
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
              />
            </div>

            <div className="flex col-span-2 gap-5 justify-between items-center ">
              <label className="font-medium">Convert to Sales</label>
              <input
                type="text"
                placeholder="Name"
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
              />
            </div> */}
          </form>

          {/* Buttons */}
          <div className="w-full flex justify-end items-center gap-4 mt-4 mr-6 text-sm font-normal">
            <p
              onClick={onclose}
              className="cursor-pointer border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
            >
              Cancel
            </p>
            <p className="cursor-pointer bg-select_layout-dark dark:text-black text-white px-6 py-1.5 rounded-sm">
              Save
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLeadDetails;
