import React, { useEffect, useState } from "react";
import { HiArrowsUpDown } from "react-icons/hi2";
import Pagination from "../../../component/Pagination";
import { LuEye } from "react-icons/lu";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import Filter from "../../../component/Filter";
import { TbFileExport } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import AddEmployee from "./AddEmployee";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";
import Edit_Profile from "../../dashboard/profile/Edit_Profile";
import ViewEmployee from "./ViewEmployee";

const itemsPerPage = 10;

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // ...


  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterParams, setFilterParams] = useState({
    fromdate: "",
    todate: "",
  });
  const [addEmployee, setAddEmployee] = useState(false);


  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/employee/getemployees`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          fromdate: filterParams.fromdate,
          todate: filterParams.todate,
        },
      });
      setEmployees(res.data.data || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, [currentPage, searchTerm, filterParams, addEmployee]);

  return (
    <>
      <div className="relative">
        <div className="font-layout-font absolute -top-13 right-0 flex justify-end items-center gap-2 pb-2">
          <p
            onClick={() => setAddEmployee(true)}
            className="cursor-pointer flex items-center dark:text-white gap-2 bg-select_layout-dark px-4 py-2 text-sm rounded-md"
          >
            <HiOutlineDocumentPlus size={18} />
            Add Employee
          </p>
          <p className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md">
            <TbFileExport />
            Export
          </p>
          <Filter
            filterParams={filterParams}
            setFilterParams={setFilterParams}
          />
        </div>
      </div>
      <div className="font-layout-font overflow-auto no-scrollbar">
        <table className="w-full xl:h-fit h-[703px] dark:text-white whitespace-nowrap">
          <thead>
            <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
              <th className="p-3.5 rounded-l-lg">S.no</th>
              {[
                "Employee ID",
                "Name",
                "Role",
                "Department",
                // "In Patient",
                "Status",
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
            {employees.length > 0 ? (
              employees.map((data, index) => (
                <tr
                  className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                  key={data.employee_id || index}
                >
                  <td className="rounded-l-lg">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>{data.employee_id}</td>
                  <td>{data.name}</td>
                  <td>{data.role_name}</td>
                  <td>{data.department}</td>
                  {/* <td>{data.inpatient}</td> */}
                  <td>{data.status}</td>
                  <td className="pl-4 p-2.5 rounded-r-lg space-x-3">
                    <button className="cursor-pointer bg-blue-200 w-fit rounded-sm py-1.5 px-1.5">
                      <Pencil
                        onClick={() =>{   setSelectedEmployeeId(data.employee_id);  setEditModal(true)}}
                        size={16}
                        className="text-blue-600"
                      />
                    </button>
                    <button  className="cursor-pointer bg-[#BAFFBA] text-green-600 w-fit rounded-sm py-1.5 px-1.5">
                      <LuEye      onClick={() =>{   setSelectedEmployeeId(data.employee_id);  setViewModal(true)}} size={16} />
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
        totalItems={totalPages * itemsPerPage}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {addEmployee && (
        <AddEmployee
          onclose={() => {
            setAddEmployee(false);
            // fetchEmployees();
          }}
        />
      )}
      {editModal && (
        <Edit_Profile
          onclose={() => setEditModal(false)}
          onSuccess={fetchEmployees}
          employeeId={selectedEmployeeId}
        />
      )}
      {viewModal && (
        <ViewEmployee
          onclose={() => setViewModal(false)}
          employeeId={selectedEmployeeId}
          employees={employees}
        />
      )}
    </>
  );
};

export default Employee;
