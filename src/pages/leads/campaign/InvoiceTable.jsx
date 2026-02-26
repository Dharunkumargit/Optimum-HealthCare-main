import React, { useState } from "react";
import { RiShareForwardLine } from "react-icons/ri";
import { HiArrowsUpDown } from "react-icons/hi2";
import { GoDownload } from "react-icons/go";
import { InvoiceTableData } from "../../../component/Data";

const InvoiceTable = () => {
  return (
    <div className="">
      {InvoiceTableData.length !== 0 ? (
        <div className="font-layout-font overflow-auto no-scrollbar h-48">
          <table className="w-full  dark:text-white whitespace-nowrap">
            <thead>
              <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
                <th className="py-4 px-2 rounded-l-lg">S.no</th>
                {[
                  "Patient Name",
                  "Surgery Fee",
                  "Additional Services",
                  "Discount",
                  "Payment Method",
                  "Invoice Number",
                ].map((heading) => (
                  <th key={heading} className="p-2">
                    <h1 className="flex items-center justify-center gap-1">
                      {heading} <HiArrowsUpDown className="dark:text-white" />
                    </h1>
                  </th>
                ))}
                <th className="pr-2 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
              {InvoiceTableData &&
                InvoiceTableData.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                  >
                    <td className="rounded-l-lg ">{index + 1}</td>
                    <td>{data.patientName}</td>
                    <td>{data.surgeryFee}</td>
                    <td>{data.additionalServices}</td>
                    <td>{data.discount}</td>
                    <td>{data.paymentMethod}</td>
                    <td>{data.invoiceNumber}</td>

                    <td className=" p-3 rounded-r-lg">
                      <div className="flex justify-center items-center gap-2">
                        <button className=" cursor-pointer p-1 rounded-sm bg-red-200 text-red-500">
                          <RiShareForwardLine size={16} />
                        </button>
                        <button className=" cursor-pointer p-1 rounded-sm bg-blue-200 text-blue-500">
                          <GoDownload size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dark:bg-layout-dark bg-layout-light text-red-500 text-center py-4 font-semibold text-lg -mt-2 rounded-lg">
          <p>No Data Available !!!</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
