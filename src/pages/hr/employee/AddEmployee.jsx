import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";

/* =======================
   VALIDATION SCHEMA
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

const AddEmployee = ({ onclose, createdByUser }) => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const status = watch("status");

  useEffect(() => {
    axios
      .get(`${API}/employee/getallemployees`)
      .then((res) => setEmployees(res.data?.data || []))
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    formData.append("created_by", createdByUser || "Admin");

    try {
      setLoading(true);
      await axios.post(`${API}/employee/add`, formData);
      toast.success("Employee created successfully");
      onclose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full p-2 rounded-md border bg-transparent text-sm focus:outline-none transition-all duration-200 dark:border-gray-600 dark:bg-layout-dark dark:text-gray-100 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-800";

  const section = "col-span-full mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300";

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
          Add New Employee
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
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
          <Input label="Address" name="address" placeholder="Residential address" />

          <div className={section}>DOCUMENTS</div>
          <Input label="Aadhaar Number" name="adhaarNumber" placeholder="12 digit Aadhaar" />
          <File label="Upload Aadhaar" name="aadhaar" />
          <File label="Health Insurance" name="healthInsuranceFile" />

          <div className={section}>SALARY</div>
          <Input label="CTC" type="number" name="ctc" placeholder="Annual CTC" />
          <Input label="Leave Balance" type="number" name="leaveBalance" />

          <div className={section}>OTHER DETAILS</div>
          <Select
            label="Reporting Manager"
            name="rpperson"
            options={employees.map((e) => ({
              value: e._id,
              label: e.name,
            }))}
          />

          <Select
            label="Status"
            name="status"
            options={["Active", "Resigned", "Terminated"]}
          />

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
              className="px-10 py-2 bg-select_layout-dark dark:text-black hover:from-blue-700 hover:to-blue-800 text-white rounded-md font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Saving..." : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

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

  function File({ label, name }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          {...register(name)}
          className="text-sm file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800/50 file:transition-all file:duration-200 file:cursor-pointer border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50/50 dark:bg-layout-dark focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
        />
      </div>
    );
  }

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

export default AddEmployee;
