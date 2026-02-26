import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../../Constant";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  userid: yup.string().required("User ID is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email ID is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits")
    .required("Phone Number is required"),
  role: yup.string().required("Role is required"),
  created_by: yup.string(),
});

const AddUser = ({ onclose ,onSuccess}) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const employee = JSON.parse(localStorage.getItem("employee"));

  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Fetch employees
  useEffect(() => {
    axios
      .get(`${API}/employee/getallemployees`)
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error("Error fetching employees", err));
  }, []);

  // Fetch roles
  useEffect(() => {
    axios
      .get(`${API}/role/all`)
      .then((res) => setRoles(res.data.data))
      .catch((err) => console.error("Error fetching roles", err));
  }, []);

  const availableUsers = users.filter((u) => !u.role_id && !u.role);

  const handleUserIdChange = (e) => {
    const selectedId = e.target.value;
    const selectedUser = users.find((u) => u.employee_id === selectedId);

    if (selectedUser) {
      setValue("userid", selectedUser.employee_id || "");
      setValue("email", selectedUser.email || "");
      setValue("phone", selectedUser.phone || "");
    }
  };

  const onSubmit = async (data) => {
    const selectedRole = roles.find((r) => r.role_name === data.role);
    if (!selectedRole) {
      alert("Please select a valid role.");
      return;
    }

    const payload = {
      role_id: selectedRole.role_id,
      role_name: selectedRole.role_name,
      department:selectedRole.department_name,
      email:data.email,
      phone:data.phone,
      created_by: employee.department,
    
    };
    const employee_id = data.userid;

    try {
      setLoading(true);
      await axios.put(`${API}/employee/updateemployee/${employee_id}`, payload);
      toast.success("user Added asuccesfully")
      onSuccess();
      onclose();
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error( "  user email already exists");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-layout-font fixed inset-0 grid justify-center items-center backdrop-blur-xs">
      <div className="mx-2 shadow-lg dark:bg-layout-dark bg-layout-light dark:text-white lg:w-[500px] md:w-[500px] w-96 rounded-lg">
        <div className="grid">
          {/* Close Button */}
          <button
            onClick={onclose}
            className="place-self-end dark:bg-layout-dark bg-layout-light rounded-full lg:-mx-4 md:-mx-4 -mx-2 lg:-my-5 md:-my-5 -my-3 lg:shadow-md md:shadow-md shadow-none lg:py-3 md:py-3 py-0 lg:px-3 md:px-3 px-0"
          >
            <IoClose className="size-[24px]" />
          </button>

          <h1 className="text-center font-bold text-xl py-2 my-2">Add User</h1>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="my-5">
            <div className="grid lg:grid-cols-12 md:grid-cols-12 items-center lg:gap-5 md:gap-5 gap-3 mb-6 mx-5">
              {/* User ID */}
              <label className="col-span-5 text-sm font-semibold">Employee name</label>
              <select
                {...register("name")}
                onChange={handleUserIdChange}
                className="col-span-7 text-xs dark:bg-layout-dark bg-layout-light border border-gray-500 rounded-lg h-11 px-2"
              >
                <option value="">Select employee</option>
                {availableUsers.map((user) => (
                  <option key={user.employee_id} value={user.employee_id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.userid && (
                <span className="text-red-500 text-xs col-span-12">
                  {errors.name.message}
                </span>
              )}

              {/* Name */}
              <label className="col-span-5 text-sm font-semibold">User ID</label>
              <input
                type="text"
                {...register("userid")}
                placeholder="Enter name"
                className="col-span-7 placeholder:dark:text-white placeholder:text-xs placeholder:font-light border border-gray-500 rounded-lg h-11 px-2"
              />
              {errors.name && (
                <span className="text-red-500 text-xs col-span-12">
                  {errors.name.message}
                </span>
              )}

              {/* Email */}
              <label className="col-span-5 text-sm font-semibold">Email ID</label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter email"
                className="col-span-7 placeholder:dark:text-white placeholder:text-xs placeholder:font-light border border-gray-500 rounded-lg h-11 px-2"
              />
              {errors.email && (
                <span className="text-red-500 text-xs col-span-12">
                  {errors.email.message}
                </span>
              )}

              {/* Phone Number */}
              <label className="col-span-5 text-sm font-semibold">
                Phone Number
              </label>
              <input
                type="text"
                {...register("phone")}
                placeholder="Enter mob.no"
                className="col-span-7 placeholder:dark:text-white placeholder:text-xs placeholder:font-light border border-gray-500 rounded-lg h-11 px-2"
              />
              {errors.mobile && (
                <span className="text-red-500 text-xs col-span-12">
                  {errors.mobile.message}
                </span>
              )}

              {/* Role */}
              <label className="col-span-5 text-sm font-semibold">Role</label>
              <select
                {...register("role")}
                className="col-span-7 text-xs dark:bg-layout-dark bg-layout-light border border-gray-500 rounded-lg h-11 px-4"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.role_id} value={r.role_name}>
                    {r.role_name}
                  </option>
                ))}
              </select>
              {errors.role && (
                <span className="text-red-500 text-xs col-span-12">
                  {errors.role.message}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="mx-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onclose}
                disabled={loading}
                className="cursor-pointer text-select_layout-dark border-select_layout-dark border px-8 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`cursor-pointer px-6 py-2 rounded text-white ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-select_layout-dark"
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
