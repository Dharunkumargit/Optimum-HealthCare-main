import React from "react";
import { IoClose } from "react-icons/io5";
import { AppointmentData } from "../../../component/Data";

const TotalAppointments = ({ onclose }) => {
  return (
    <div className=" font-layout-font fixed inset-0 flex justify-center items-center backdrop-blur-sm z-10">
      <div className="dark:bg-overall_bg-dark bg-overall_bg-light rounded-lg drop-shadow-md dark:text-white w-fit h-fit">
        <p
          className="grid place-self-end -mx-4 -my-4 dark:bg-layout-dark bg-layout-light shadow-sm  py-3 px-3 rounded-full"
          onClick={onclose}
        >
          <IoClose className="size-[20px]" />
        </p>
        <div className="grid justify-center px-8 py-2 gap-2">
          <p className="text-center font-bold text-lg ">
            Total Appointments
          </p>
          <div className="font-layout-font overflow-auto no-scrollbar">
            <table className="w-[1000px] dark:text-white whitespace-nowrap">
              <thead>
                <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
                  <th className="p-2.5 rounded-l-lg">S.no</th>
                  {["Token No", "Name", "Phone Number", "Date", "Slot"].map(
                    (heading) => (
                      <th key={heading} className="p-2">
                        <h1 className="flex items-center justify-center gap-1">
                          {heading}{" "}
                        
                        </h1>
                      </th>
                    )
                  )}
                  <th className="pr-2 rounded-r-lg">Status</th>
                </tr>
              </thead>

              <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
                {AppointmentData.length > 0 ? (
                  AppointmentData.map((data, index) => (
                    <tr
                      key={index}
                      className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                    >
                      <td className="rounded-l-lg">{index + 1}</td>
                      <td>{data.tokenNo}</td>
                      <td>{data.name}</td>
                      <td>{data.phoneNumber}</td>
                      <td>{data.date}</td>
                      <td>{data.slot}</td>
                      <td
                        className={`first-letter:uppercase p-1 rounded-r-lg
                               ${
                                 data.status === "reschedule"
                                   ? " text-blue-600"
                                   : data.status === "completed"
                                   ? " text-green-600"
                                   : data.status === "cancelled"
                                   ? " text-red-600"
                                   : " text-gray-600"
                               }`}
                      >
                        {data.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-500">
                      No matching results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalAppointments;
