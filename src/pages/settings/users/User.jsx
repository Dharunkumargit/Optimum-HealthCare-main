import React, { useEffect, useState } from "react";
import { HiArrowsUpDown } from "react-icons/hi2";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import Pagination from "../../../component/Pagination";
import { useSearch } from "../../../component/SearchBar";
import { useNavigate } from "react-router-dom";
import Filter from "../../../component/Filter";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { TbFileExport } from "react-icons/tb";
import { LuUserRoundPlus } from "react-icons/lu";
import DeleteModal from "../../../component/DeleteModal";
import axios from "axios";
import { API } from "../../../Constant";
import { toast } from "react-toastify";

const User = () => {
  const itemsPerPage = 10;

  // ✅ State
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterParams, setFilterParams] = useState({ fromdate: "", todate: "" });

  const [addUserModal, setAddUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null); // ✅ to pass user data to EditUser
  const [deleteUserId, setDeleteUserId] = useState(null);

  const { searchTerm } = useSearch(); // ✅ global search context

  // ✅ Fetch Users from API
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
const usersWithRole = res.data.data
  .filter(user => user.role_id && user.role_name)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // ✅ newest first



      setEmployees(usersWithRole || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm, filterParams]);

  // ✅ Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Handlers
  const handleAddUser = () => setAddUserModal(true);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId);
    setDeleteModal(true);
  };

// ✅ Only remove user's role, not delete employee record
const confirmDelete = async () => {
  try {
    await axios.put(`${API}/employee/removeuser/${deleteUserId}`);
    toast.success("User role removed successfully");
    fetchEmployees();
  } catch (err) {
    toast.error("Failed to remove user role");
  } finally {
    setDeleteModal(false);
  }
};


  return (
    <>
      <div className="relative">
        <div className="font-layout-font absolute -top-13 right-0 flex justify-end items-center gap-2 pb-2">
          <p
            onClick={handleAddUser}
            className="cursor-pointer flex items-center dark:text-white gap-2 bg-select_layout-dark px-4 py-2 text-sm rounded-md"
          >
            <LuUserRoundPlus /> Add User
          </p>
          <p className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md">
            <TbFileExport />
            Export
          </p>
          <Filter setFilterParams={setFilterParams} />
        </div>
      </div>

      <div className="font-layout-font overflow-auto no-scrollbar">
        <table className="w-full xl:h-fit h-[703px] dark:text-white whitespace-nowrap">
          <thead>
            <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
              <th className="p-4 rounded-l-lg">S.no</th>
              {["Name", "Roles", "Phone Number", "Email", "Status", "Created By"].map((heading) => (
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
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((data, index) => (
                <tr key={data._id} className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center">
                  <td className="rounded-l-lg">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.role_name}</td>
                  <td>{data.phone}</td>
                  <td>{data.email}</td>
                  <td>{data.status}</td>
                  <td>{data.created_by}</td>
                  <td className="flex items-center justify-center py-2.5">
                    <button
                      onClick={() => handleEditUser(data)}
                      className="cursor-pointer p-1.5 bg-blue-300 text-blue-500 rounded-sm mx-2"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(data.employee_id)}
                      className="cursor-pointer mx-2 p-1.5 bg-pink-200 text-red-500 rounded-sm"
                    >
                      <RiDeleteBinLine />
                    </button>
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

      <Pagination totalItems={totalPages * itemsPerPage} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* ✅ Modals */}
      {addUserModal && <AddUser onclose={() => setAddUserModal(false)} onSuccess={fetchEmployees} />}
      {editUserModal && <EditUser selectedUser={selectedUser} onclose={() => setEditUserModal(false)} onSuccess={fetchEmployees} />}
      {deleteModal && <DeleteModal onclose={() => setDeleteModal(false)} onConfirm={confirmDelete} title="User" />}
    </>
  );
};

export default User;
