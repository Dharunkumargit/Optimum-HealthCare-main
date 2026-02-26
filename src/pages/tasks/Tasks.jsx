import React, { useEffect, useState } from "react";
import { HiArrowsUpDown } from "react-icons/hi2";
import Pagination from "../../component/Pagination";
import { LuEye } from "react-icons/lu";
import { TbFileExport } from "react-icons/tb";
import Filter from "../../component/Filter";
import { useSearch } from "../../component/SearchBar";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, File } from "lucide-react";
import { RiDeleteBinLine } from "react-icons/ri";
import NavBar from "../../component/NavBar";
import AddTasks from "./AddTasks";
import EditTasks from "./EditTasks";
import axios from "axios";
import { API, formatDate } from "../../Constant";
import { toast } from "react-toastify";
import DeleteModal from "../../component/DeleteModal";
import usePermission from "../../hooks/UsePermissions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addTasks, setAddTasks] = useState(false);
  const [edittasks, setEdittasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);

  const { searchTerm } = useSearch();
  const [filterParams, setFilterParams] = useState({
    fromdate: "",
    todate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [DeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const [DeleteId, setDeleteId] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("employee"));

  // ✅ Permission-based access
  const { hasPermission } = usePermission(user);

  const canView = hasPermission("Tasks", "View");
  const canCreate = hasPermission("Tasks", "Create");
  const canDelete = hasPermission("Tasks", "Delete");
  const canExport = hasPermission("Tasks", "Download");

  const statusColorMap = {
    doing: "font-bold text-blue-700",
    completed: "font-bold text-green-700",
    incomplete: "font-bold text-red-700",
  };

  // Fetch all employees
  useEffect(() => {
    axios
      .get(`${API}/employee/getallemployees`)
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/task/getalltasks`, {
        params: {
          department: user.department,
          employee_id: user.employee_id,
        },
      });
      setTasks(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage, filterParams]);

  // Delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/task/Deletetask/${id}`);
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Filter + search
  const filteredTasks = tasks
    .filter(
      (task) =>
        user.department === "admin" ||
        task.assigned_to.includes(user.employee_id)
    )
    .filter((task) => {
      if (!filterParams.fromdate && !filterParams.todate) return true;
      const Created = new Date(task.createdAt || task.CreatedAt);

      if (filterParams.fromdate && Created < new Date(filterParams.fromdate))
        return false;
      if (filterParams.todate && Created > new Date(filterParams.todate))
        return false;
      return true;
    })
    .map((task) => {
      let assignedNames = [];
      if (user.department === "admin") {
        assignedNames = task.assigned_to.map(
          (id) => users.find((u) => u.employee_id === id)?.name || id
        );
      } else {
        assignedNames = task.assigned_to
          .filter((id) => id === user.employee_id)
          .map((id) => users.find((u) => u.employee_id === id)?.name || id);
      }
      return { ...task, assigned_to_name: assignedNames.join(", ") };
    })
    .filter((task) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        task.task_title?.toLowerCase().includes(term) ||
        task.assigned_to_name?.toLowerCase().includes(term) ||
        task.status?.toLowerCase().includes(term)
      );
    });

  // Pagination
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterParams, tasks, users]);

  const exportData = filteredTasks.map((task, index) => ({
    "S.No": index + 1,
    "Task Title": task.task_title,
    "Start Date": formatDate(task.start_date),
    "Due Date": formatDate(task.due_date),
    "Assigned To": task.assigned_to_name,
    Status: task.status,
  }));

 const exportToPDF = () => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [["S.No", "Task", "Start Date", "Due Date", "Assigned To", "Status"]],
    body: filteredTasks.map((task, index) => [
      index + 1,
      task.task_title,
      formatDate(task.start_date),
      formatDate(task.due_date),
      task.assigned_to_name,
      task.status,
    ]),
  });

  doc.save("Tasks.pdf");
};


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Tasks_Report.xlsx");
  };

  return (
    <>
      <NavBar title="Tasks" pagetitle="Tasks" />

      {/* ✅ Top Action Buttons */}
      <div className="font-layout-font flex justify-end items-center gap-2 pb-2">
        {canCreate && (
          <button
            onClick={() => setAddTasks(true)}
            className="cursor-pointer flex items-center dark:text-white gap-2 bg-select_layout-dark px-4 py-2 text-sm rounded-md"
          >
            <div className="relative w-6 h-6">
              <File className="absolute w-6 h-6" />
              <AlertTriangle className="absolute left-1.5 top-2 w-3 h-3" />
            </div>
            <span>Add Task</span>
          </button>
        )}

     {canExport && (
  <div className="relative">
    <button
      onClick={() => setExportOpen(!exportOpen)}
      className="cursor-pointer flex items-center gap-1.5 dark:text-white dark:bg-layout-dark bg-layout-light px-4 py-2 rounded-md "
    >
      <TbFileExport />
      Export
    </button>

    {exportOpen && (
      <div className="absolute right-0 mt-2 bg-white dark:bg-layout-dark shadow-lg dark:text-white text-black  border dark:border-gray-700 rounded-md z-50 w-40">
        <button
          onClick={() => {
            exportToPDF();
            setExportOpen(false);
          }}
          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Export PDF
        </button>

        <button
          onClick={() => {
            exportToExcel();
            setExportOpen(false);
          }}
          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Export Excel
        </button>
      </div>
    )}
  </div>
)}


        <div className="cursor-pointer flex items-center gap-3 dark:text-white dark:bg-layout-dark bg-layout-light rounded-md">
          <Filter onFilterChange={setFilterParams} />
        </div>
      </div>

      {/* ✅ Tasks Table */}
      <div className="font-layout-font overflow-auto no-scrollbar">
        <table className="w-full xl:h-fit h-[703px] dark:text-white whitespace-nowrap">
          <thead>
            <tr className="font-semibold text-sm dark:bg-layout-dark bg-layout-light border-b-2 dark:border-overall_bg-dark border-overall_bg-light">
              <th className="p-3.5 rounded-l-lg">S.no</th>
              {["Tasks", "Start Date", "Due Date"].map(
                (heading) => (
                  <th key={heading} className="p-5">
                    <h1 className="flex items-center justify-center gap-1">
                      {heading} <HiArrowsUpDown className="dark:text-white" />
                    </h1>
                  </th>
                  
                )
              )}
              {user.department === "admin" ?<th>Assigned to</th> :<th>Assigned by</th>}
<th>Status</th>
              {(canView || canDelete) && (
                <th className="pr-2 rounded-r-lg">Action</th>
              )}
            </tr>
          </thead>

          <tbody className="dark:bg-layout-dark bg-layout-light rounded-2xl dark:text-gray-200 text-gray-600 cursor-default">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  Loading tasks...
                </td>
              </tr>
            ) : paginatedTasks.length > 0 ? (
              paginatedTasks.map((data, index) => (
                <tr
                  className="border-b-2 dark:border-overall_bg-dark border-overall_bg-light text-center"
                  key={data._id}
                >
                  <td className="rounded-l-lg p-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>{data.task_title}</td>
                  <td>{formatDate(data.start_date)}</td>
                  <td>{formatDate(data.due_date)}</td>
                   {user.department === "admin" ? <td>{data.assigned_to_name}</td> :<td>{data.createdBy || data.created_by}</td>}
                  <td className="first-letter:capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        statusColorMap[data.status] || "text-gray-700"
                      }`}
                    >
                      {data.status}
                    </span>
                  </td>

                  {(canView || canDelete) && (
                    <td className="pl-4 p-2.5 rounded-r-lg space-x-2">
                      {canView && (
                        <button
                          className="cursor-pointer bg-[#BAFFBA] text-green-600 w-fit rounded-sm py-1.5 px-1.5"
                          onClick={() =>
                            navigate(`/tasks/viewtasks`, {
                              state: { task: data },
                            })
                          }
                        >
                          <LuEye size={16} />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => {
                            setDeleteId(data._id);
                            setDeleteModalOpen(true);
                          }}
                          className="cursor-pointer bg-pink-200 text-red-500 w-fit rounded-sm py-1.5 px-1.5"
                        >
                          <RiDeleteBinLine size={16} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredTasks.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {addTasks && (
        <AddTasks onclose={() => setAddTasks(false)} onSuccess={fetchTasks} />
      )}
      {edittasks && (
        <EditTasks task={selectedTask} onclose={() => setEdittasks(false)} />
      )}
      {DeleteModalOpen && (
        <DeleteModal
          title="task"
          onclose={() => setDeleteModalOpen(false)}
          onConfirm={async () => {
            await handleDelete(DeleteId);
            setDeleteModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Tasks;
