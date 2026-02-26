import React from "react";
import { IoClose } from "react-icons/io5";
import { appointmentData } from "../../../component/Data";

const TotalRevenue = ({ onclose }) => {
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
          <p className="text-center font-bold text-lg ">Total Revenue</p>
           <div className="font-layout-font overflow-auto no-scrollbar">
                <table className="w-[1000px] dark:text-white whitespace-nowrap">
                  <thead>
                    <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
                      <th className="p-2.5 rounded-l-lg">S.no</th>
                      {["Date", "Total Appointments Scheduled", "Total Appreciation Completed"].map((heading) => (
                        <th key={heading} className="p-2 text-center">
                          <h1 className="flex items-center justify-center gap-1">
                            {heading} 
                          </h1>
                        </th>
                      ))}
                       <th className="pr-2 rounded-r-lg">Total Revenue</th>
                    </tr>
                  </thead>
        
                  <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 text-center">
                    {appointmentData.length > 0 ? (
                      appointmentData.map((data, index) => (
                        <tr key={index} className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
                          <td className=" rounded-l-lg">{ index + 1}</td>
                          <td>{data.date}</td>
                          <td>{data.totalAppointments}</td>
                          <td>{data.appreciationCompleted}</td>
                          <td className="space-x-2 rounded-r-lg p-1">₹{data.revenue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-gray-500">
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

export default TotalRevenue;
