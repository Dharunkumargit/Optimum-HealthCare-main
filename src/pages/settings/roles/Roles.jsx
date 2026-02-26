import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiArrowsUpDown, HiOutlineUserGroup } from "react-icons/hi2";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { TbFileExport } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Filter from "../../../component/Filter";
import Pagination from "../../../component/Pagination";
import { useSearch } from "../../../component/SearchBar";
import DeleteModal from "../../../component/DeleteModal";
import { API } from "../../../Constant";
import { toast } from "react-toastify";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [filterParams, setFilterParams] = useState({
    fromdate: "",
    todate: "",
  });

  const { searchTerm } = useSearch();
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/role/all`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          ...filterParams,
        },
      });

      setRoles(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [currentPage, searchTerm, filterParams]);

  useEffect(() => {
    if (!searchTerm) return setFilteredData(roles);

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = roles.filter((role) =>
      Object.values(role).some((val) =>
        val?.toString().toLowerCase().includes(lowerSearchTerm)
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, roles]);

  const handleDeleteClick = (roleId) => {
    setSelectedRole(roleId);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/role/delete?roleId=${selectedRole}`);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteModal(false);
    }
  };

  return (
    <>
      {/* Header Actions */}
      <div className="relative">
        <div className="absolute -top-13 right-0 flex gap-2">
          <p
            onClick={() => navigate("addrole")}
            className="cursor-pointer flex items-center gap-2 dark:text-white bg-select_layout-dark px-4 py-2 text-sm rounded-md"
          >
            <HiOutlineUserGroup size={24} /> Add Role
          </p>
          <p className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md">
            <TbFileExport /> Export
          </p>
          <Filter />
        </div>
      </div>

      {/* Table */}
      <div className="font-layout-font overflow-auto no-scrollbar">
        {" "}
        <table className="w-full xl:h-fit h-[703px] dark:text-white whitespace-nowrap">
          <thead>
            <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
              <th className="p-4 rounded-l-lg">S.no</th>
              {["Name", "Roles", "Created By"].map((heading) => (
                <th key={heading} className="p-5">
                  <h1 className="flex items-center justify-center gap-1">
                    {heading} <HiArrowsUpDown className="dark:text-white" />
                  </h1>
                </th>
              ))}
              <th className="rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
            {filteredData.length > 0 ? (
              filteredData.map((role, index) => (
                <tr
                  key={index}
                  className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                >
                  <td className="rounded-l-lg p-2.5">{index + 1}</td>
                  <td>{role.name}</td>
                  <td className="uppercase">{role.role_name}</td>
                  <td>{role.created_by_user}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() =>
                        navigate("editrole", {
                          state: {
                            roleId: role.role_id,
                          },
                        })
                      }
                      className="p-1.5 bg-blue-300 text-blue-500 rounded-sm"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(role.role_id)}
                      className="p-1.5 bg-pink-200 text-red-500 rounded-sm"
                    >
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-10">
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

      {deleteModal && (
        <DeleteModal
          onclose={() => setDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Role"
        />
      )}
    </>
  );
};

export default Roles;
