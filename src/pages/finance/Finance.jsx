import React, { useEffect, useState } from "react";
import NavBar from "../../component/NavBar";
import { TbFileExport } from "react-icons/tb";
import { Pencil } from "lucide-react";
import { HiArrowsUpDown } from "react-icons/hi2";
import { FiTrash2 } from "react-icons/fi";
import { FinanceData } from "../../component/Data";
import Pagination from "../../component/Pagination";
import Edit_Finance from "./Edit_Finance";
import { useSearch } from "../../component/SearchBar";
import Filter from "../../component/Filter";
import DeleteModal from "../../component/DeleteModal";

const Finance = () => {
  const { searchTerm } = useSearch();
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [Edit_Finance_Model, setEdit_Finance_Model] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(FinanceData);
      return;
    }

    const lowerSearchTerm = searchTerm.toString().toLowerCase();

    const filtered = FinanceData.filter((item) =>
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

  const OpenModel = () => {
    setEdit_Finance_Model(true);
  };

  return (
    <div className="">
      <NavBar title="Finance" pagetitle="Finance" />
      <div className="right-0 flex justify-end items-center gap-2 pb-2">
        <p className="cursor-pointer flex items-center gap-1.5 dark:text-layout_text-dark text-layout_text-light dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md">
          <TbFileExport />
          Export
        </p>
        <Filter />
      </div>
      <div className="font-layout-font overflow-auto no-scrollbar">
        <table className="w-full xl:h-fit h-[703px] dark:text-white whitespace-nowrap">
          <thead>
            <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
              <th className="p-3.5 rounded-l-lg">S.no</th>
              {[
                "Invoice Id",
                "Name",
                "Hospital",
                "Doctor ",
                "Payment",
                "Total Bill",
                "Settled Amount",
                "Company",
                "Profits",
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
          <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
            {FinanceData.map((data, index) => (
              <tr
                key={index}
                className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
              >
                <td className="rounded-l-lg ">{index + 1}.</td>{" "}
                <td>{data.invoiceId}</td>
                <td>{data.name}</td>
                <td className="px-4">{data.hospitalName}</td>
                <td>{data.doctorName}</td>
                <td>{data.paymentType}</td>
                <td>{data.totalBill}</td>
                <td>{data.settledAmount}</td>
                <td>{data.company}</td>
                <td>{((data.profits / data.totalBill) * 100).toFixed(0)}%</td>
                <td className="pl-4 p-2.5 rounded-r-lg">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      className=" cursor-pointer p-1 rounded-sm  bg-blue-200 text-blue-500 "
                      onClick={OpenModel}
                    >
                      <Pencil size={16} />
                    </button>
                    {/* <button
                      onClick={() => setDeleteModal(true)}
                      className=" cursor-pointer p-1 rounded-sm  bg-red-200 text-red-500"
                    >
                      <FiTrash2 size={16} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={FinanceData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {Edit_Finance_Model && (
        <Edit_Finance
          onClose={() => {
            setEdit_Finance_Model(false);
          }}
        />
      )}
      {deleteModal && (
        <DeleteModal onclose={() => setDeleteModal(false)} title="Finance" />
      )}
    </div>
  );
};

export default Finance;
