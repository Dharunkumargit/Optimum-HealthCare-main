import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose, IoDocument, IoEye } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";

/* =======================
   VALIDATION SCHEMA (Exact same as AddEmployee)
======================= */
const schema = yup.object({
  name: yup.string().required("Full Name required"),
  fatherName: yup.string().required("Father Name required"),
  gender: yup.string().required("Select gender"),
  dob: yup.date().required("Date of birth required"),
  qualification: yup.string().required("Qualification required"),
  jobTitle: yup.string().required("Job title required"),
  dateOfJoining: yup.date().required("Joining date required"),
  phone: yup.string().matches(/^\d{10}$/, "Invalid phone").required(),
  email: yup.string().email("Invalid email").required(),
  address: yup.string().required("Address required"),
  adhaarNumber: yup.string().matches(/^\d{12}$/, "Invalid Aadhaar"),
  rpperson: yup.string().required("Reporting person required"),
  ctc: yup.number().positive().required(),
  leaveBalance: yup.number().min(0),
  status: yup.string().required(),
  bankAccount: yup.string(),
  lastIncrementDate: yup.date().nullable(),
  lastIncrementCtc: yup.number().nullable(),
  exitDate: yup.date().nullable(),
});

const Edit_Profile = ({ onclose, employeeId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [initialData, setInitialData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  const status = watch("status");
  const aadhaarFile = watch({ name: "aadhaar" });
  const healthFile = watch({ name: "healthInsuranceFile" });

  // Fetch employee data on mount
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`${API}/employee/getemployee/${employeeId}`);
        let data = res.data.data;

        // Format dates for input[type="date"]
        if (data.dob) data.dob = new Date(data.dob).toISOString().split("T")[0];
        if (data.dateOfJoining) data.dateOfJoining = new Date(data.dateOfJoining).toISOString().split("T")[0];
        if (data.lastIncrementDate) data.lastIncrementDate = new Date(data.lastIncrementDate).toISOString().split("T")[0];
        if (data.exitDate) data.exitDate = new Date(data.exitDate).toISOString().split("T")[0];

        setInitialData(data);
        reset(data);
      } catch (err) {
        toast.error("Failed to load employee data");
      }
    };

    const fetchAllEmployees = async () => {
      try {
        const res = await axios.get(`${API}/employee/getallemployees`);
        setEmployees(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load employees");
      }
    };

    fetchEmployee();
    fetchAllEmployees();
  }, [employeeId, reset]);

const onSubmit = async (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof FileList && value.length > 0) {
      formData.append(key, value[0]);
    } else if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  try {
    setLoading(true);
    await axios.put(`${API}/employee/updateemployee/${employeeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success("Employee updated successfully");
    onSuccess?.();
    onclose();
  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed");
  } finally {
    setLoading(false);
  }
};


  const input =
    "w-full p-2 rounded-md border bg-transparent text-sm focus:outline-none transition-all duration-200 dark:border-gray-600 dark:bg-layout-dark dark:text-gray-100 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-800";

  const section = "col-span-full mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300";

  if (!initialData) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center backdrop-blur-sm bg-black/30 dark:bg-black/50">
        <div className="text-center py-10 text-gray-700 dark:text-gray-300 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center backdrop-blur-sm bg-black/30 dark:bg-black/50">
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-layout-dark text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <button
          onClick={onclose}
          className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 p-2 rounded-full transition-all duration-200 shadow-lg"
        >
          <IoClose className="text-white text-lg" />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">
          Edit Employee
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={section}>BASIC INFORMATION</div>
          <Input label="Full Name" name="name" placeholder="Enter full name" />
          <Input label="Father Name" name="fatherName" placeholder="Enter father name" />
          <Select label="Gender" name="gender" options={["Male", "Female"]} />
          <Input label="Date of Birth" type="date" name="dob" />

          <Input label="Qualification" name="qualification" placeholder="e.g. B.Tech / MBA" />
          <Input label="Job Title" name="jobTitle" placeholder="e.g. Software Engineer" />
          <Input label="Date of Joining" type="date" name="dateOfJoining" />

          <div className={section}>CONTACT DETAILS</div>
          <Input label="Phone Number" name="phone" placeholder="10 digit mobile number" />
          <Input label="Email Address" name="email" placeholder="example@mail.com" />
          <Input label="Address" name="address" placeholder="Residential address" full />

          <div className={section}>DOCUMENTS</div>
          <Input label="Aadhaar Number" name="adhaarNumber" placeholder="12 digit Aadhaar" />
          <File 
            label="Upload Aadhaar" 
            name="aadhaar"
            currentFile={initialData.aadhaarFileName || initialData.aadhaar}
            currentUrl={initialData.aadhaarUrl}
        
          />
          <File 
            label="Health Insurance" 
            name="healthInsuranceFile"
            currentFile={initialData.healthInsuranceFileName || initialData.healthInsuranceFile}
            currentUrl={initialData.healthInsuranceUrl}
           
          />

          <div className={section}>SALARY</div>
          <Input label="CTC" type="number" name="ctc" placeholder="Annual CTC" />
          <Input label="Leave Balance" type="number" name="leaveBalance" />

          <div className={section}>OTHER DETAILS</div>
          <Select
            label="Reporting Manager"
            name="rpperson"
            options={employees
              .filter((e) => e._id !== initialData._id)
              .map((e) => ({
                value: e._id,
                label: e.name,
              }))}
          />

          <Select label="Status" name="status" options={["Active", "Resigned", "Terminated"]} />

          <Input label="Bank Account No" name="bankAccount" placeholder="Account number" />
          <Input label="Last Increment Date" type="date" name="lastIncrementDate" />
          <Input label="Last Increment CTC" type="number" name="lastIncrementCtc" />

          {status === "Terminated" && (
            <Input label="Exit Date" type="date" name="exitDate" full />
          )}

          <div className="col-span-full flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6 bg-gray-50/50 dark:bg-layout-dark rounded-lg p-4">
            <button
              type="button"
              onClick={onclose}
              className="px-8 py-2 border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 rounded-md font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // SAME Input component
  function Input({ label, name, type = "text", placeholder, full }) {
    return (
      <div className={`flex flex-col gap-1 ${full && "md:col-span-2"}`}>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={input}
        />
        {errors[name] && (
          <span className="text-xs text-red-500 font-medium mt-1">{errors[name].message}</span>
        )}
      </div>
    );
  }

  function File({ label, name, currentFile, currentUrl }) {
    const files = watch(name);
    const hasNewFile = files && files[0];

    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        
        {/* Current File Display - only if no new file selected */}
        {currentFile && !hasNewFile && (
          <div className="mb-2 p-2 bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-xs text-green-800 dark:text-green-200">
            <div className="flex items-center gap-2">
              <IoDocument className="text-green-500" />
              <span>Current: {currentFile}</span>
              {currentUrl && (
                <a 
                  href={currentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-xs font-medium"
                >
                  <IoEye /> View
                </a>
              )}
            </div>
          </div>
        )}

        {/* New File Selected Display */}
        {hasNewFile && (
          <div className="mb-2 p-2 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-xs text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <IoDocument className="text-blue-500" />
              <span>New: {files[0].name} ({(files[0].size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          </div>
        )}

        {/* File Input */}
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          {...register(name)}
          className="text-sm file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800/50 file:transition-all file:duration-200 file:cursor-pointer border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50/50 dark:bg-layout-dark focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
        />
      </div>
    );
  }

  // SAME Select component
  function Select({ label, name, options }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <select {...register(name)} className={input}>
          <option value="">Select</option>
          {options.map((o, i) =>
            typeof o === "string" ? (
              <option key={i}>{o}</option>
            ) : (
              <option key={i} value={o.value}>
                {o.label}
              </option>
            )
          )}
        </select>
      </div>
    );
  }
};

export default Edit_Profile;
