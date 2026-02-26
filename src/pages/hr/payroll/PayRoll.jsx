import React, { useEffect, useState } from "react";
import { HiArrowsUpDown } from "react-icons/hi2";
import Pagination from "../../../component/Pagination";
import { LuEye } from "react-icons/lu";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import Filter from "../../../component/Filter";
import { TbFileExport } from "react-icons/tb";
import { useSearch } from "../../../component/SearchBar";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { payrollData } from "../../../component/Data";

const PayRoll = () => {
  const { searchTerm } = useSearch();
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 10;
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(payrollData);
      return;
    }

    const lowerSearchTerm = searchTerm.toString().toLowerCase();

    const filtered = payrollData.filter((item) =>
      Object.values(item).some((value) => {
        const lowerValue = value.toString().toLowerCase();

        if (lowerValue === lowerSearchTerm) return true;

        if (!isNaN(searchTerm) && lowerValue.includes(searchTerm)) return true;

        return lowerValue.startsWith(lowerSearchTerm);
      })
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div className="relative">
        <div className="font-layout-font absolute -top-13 right-0 flex justify-end items-center gap-2 pb-2">
          <p className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md">
            <TbFileExport />
            Export
          </p>
          <Filter />
        </div>
      </div>
      <div className="font-layout-font overflow-auto no-scrollbar">
        <table className=" w-full xl:h-fit h-[703px]  dark:text-white whitespace-nowrap">
          <thead>
            <tr className=" font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light ">
              <th className=" p-3.5 rounded-l-lg">S.no</th>
              {[
                "Employee Name",
                "Month",
                "Salary ",
                "Deductions ",
                "Overtime ",
                "Net Pay",
              ].map((heading) => (
                <th key={heading} className="p-5">
                  <h1 className="flex items-center justify-center gap-1">
                    {heading} <HiArrowsUpDown className="dark:text-white" />
                  </h1>
                </th>
              ))}
              <th className="pr-2 rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600   cursor-default">
            {paginatedData.length > 0 ? (
              paginatedData.map((data, index) => (
                <tr
                  className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center "
                  key={index}
                >
                  <td className="rounded-l-lg ">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>{data["Employee Name"]}</td>
                  <td>{data["Month"]}</td>
                  <td>
                    {`${"₹"}`}
                    {data["Salary "]}
                  </td>
                  <td>
                    {`${"₹"}`}
                    {data["Deductions "]}
                  </td>
                  <td>
                    {`${"₹"}`} {data["Overtime "]}
                  </td>
                  <td>
                    {`${"₹"}`}
                    {data["Net Pay"]}
                  </td>
                  <td className="pl-4 p-2.5 rounded-r-lg space-x-3">
                    {" "}
                    <button className="cursor-pointer bg-blue-200 w-fit rounded-sm py-1.5 px-1.5">
                      <Pencil size={16} className="text-blue-600" />
                    </button>{" "}
                    <button
                      onClick={() => navigate("viewcampaign")}
                      className="cursor-pointer bg-[#BAFFBA] text-green-600 w-fit rounded-sm py-1.5 px-1.5"
                    >
                      {" "}
                      <LuEye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-10 text-gray-500">
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

    </>
  );
};

export default PayRoll;
