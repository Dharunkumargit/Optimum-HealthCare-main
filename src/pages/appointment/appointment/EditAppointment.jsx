import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";

const schema = yup.object().shape({
  patient_type: yup.string().required("Select patient type"),
  patient_name: yup.string().required("Patient name is required"),
  age: yup.number().typeError("Enter valid age").required("Age is required"),
  gender: yup.string().required("Select gender"),
  treatment: yup.string().required("Treatment is required"),
  city: yup.string().required("City is required"),
  surgeon_name: yup.string().required("Surgeon name is required"),
  medical_coordinator: yup.string().required("Coordinator name required"),
  coordinator_number: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
    .required("Coordinator number is required"),
  consultation_type: yup.string().when("patient_type", {
    is: "OPD",
    then: () => yup.string().required("Consultation type required"),
  }),
  op_time: yup.string().when("patient_type", {
    is: "OPD",
    then: () => yup.string().required("OP time required"),
  }),
  op_date: yup.string().when("patient_type", {
    is: "OPD",
    then: () => yup.string().required("OP date required"),
  }),
  surgery_date: yup.string().when("patient_type", {
    is: "IPD",
    then: () => yup.string().required("Surgery date required"),
  }),
  admission_time: yup.string().when("patient_type", {
    is: "IPD",
    then: () => yup.string().required("Admission time required"),
  }),
  ot_time: yup.string().when("patient_type", {
    is: "IPD",
    then: () => yup.string().required("OT time required"),
  }),
  hospital_name: yup.string().when("consultation_type", {
    is: "Office",
    then: () => yup.string().required("Hospital name required"),
  }),
  hospital_address: yup.string().when("consultation_type", {
    is: "Office",
    then: () => yup.string().required("Hospital address required"),
  }),
  amount: yup
    .number()
    .typeError("Enter valid amount")
    .required("Amount required"),
  payment_mode: yup.string().required("Select payment mode"),
  status: yup.string().required("Select status"),
});

const EditAppointment = ({ onclose, appointment, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [consultationType, setConsultationType] = useState(
    appointment.consultation_type || "Online"
  );
  const [patientType, setPatientType] = useState(appointment.patient_type);

  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [coordinatorSearch, setCoordinatorSearch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: appointment,
  });

  useEffect(() => {
    // Pre-fill form fields
    Object.keys(appointment).forEach((key) =>
      setValue(key, appointment[key] || "")
    );
    setPatientType(appointment.patient_type);
    setConsultationType(appointment.consultation_type || "Online");
    fetchDropdownData();
  }, [appointment, setValue]);

  const fetchDropdownData = async () => {
    try {
      const [doctorRes, hospitalRes, coordinatorRes] = await Promise.all([
        axios.get(`${API}/doctor/getalldoctors`),
        axios.get(`${API}/hospital/getallhospitals`),
        axios.get(`${API}/employee/getallemployees`),
      ]);
      setDoctors(doctorRes.data.data || []);
      setHospitals(hospitalRes.data.data || []);
      setCoordinators(coordinatorRes.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch dropdown data");
    }
  };

  const handleTypeChange = (type) => {
    setPatientType(type);
    setValue("patient_type", type);
  };

  const handleHospitalChange = (id) => {
    const selected = hospitals.find((h) => h._id === id);
    if (selected) {
      setValue("hospital_name", selected.hospital_name);
      setValue("hospital_address", selected.address || "");
    }
  };
  const selectedHospitalId =
    hospitals.find((h) => h.hospital_name === watch("hospital_name"))?._id ||
    "";

  const handleCoordinatorChange = (id) => {
    const selected = coordinators.find((c) => c._id === id);
    if (selected) {
      setValue("medical_coordinator", selected.name);
      setValue("coordinator_number", selected.phone || "");
    }
  };
  const selectedCoordinatorId =
    coordinators.find((c) => c.name === watch("medical_coordinator"))?._id ||
    "";

  const handleDoctorChange = (id) => {
    const selected = doctors.find((d) => d._id === id);
    if (selected) {
      setValue("surgeon_name", selected.doctor_name);
    }
  };

  const selectedDoctorId =
    doctors.find((d) => d.doctor_name === watch("surgeon_name"))?._id || "";

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        consultation_type: patientType === "OPD" ? consultationType : null,
      };
      await axios.put(
        `${API}/appointment/updateappointment/${appointment.token_id}`,
        payload
      );
      toast.success("Appointment updated successfully");
      onclose();
      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-layout-dark dark:text-white rounded-lg shadow-lg p-6 w-[950px] max-w-full relative text-sm">
        <button
          onClick={onclose}
          className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 dark:bg-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <IoClose className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4 dark:text-white">
          Edit Appointment
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          {/* Patient Type */}
          <div>
            <label>Patient Type</label>
            <select
              {...register("patient_type")}
              value={patientType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white"
            >
              <option value="OPD">OPD</option>
              <option value="IPD">IPD</option>
            </select>
          </div>

          {/* Patient Name */}
          <div>
            <label>Patient Name</label>
            <input
              {...register("patient_name")}
              placeholder="Full Name"
              className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500"
            />
            {errors.patient_name && (
              <p className="text-red-500 text-xs">
                {errors.patient_name.message}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label>Age</label>
            <input
              {...register("age")}
              type="number"
              placeholder="Age"
              className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500"
            />
            {errors.age && (
              <p className="text-red-500 text-xs">{errors.age.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label>Gender</label>
            <select
              {...register("gender")}
              className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Treatment */}
          <div>
            <label>Treatment</label>
            <input
              {...register("treatment")}
              placeholder="Treatment type"
              className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500"
            />
          </div>

          {/* City */}
          <div>
            <label>City</label>
            <input
              {...register("city")}
              placeholder="City"
              className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500"
            />
          </div>

          {/* Surgeon Dropdown */}
          <div>
            <label>Surgeon Name</label>

            <select
              value={selectedDoctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white"
            >
              <option value="">Select Surgeon</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.doctor_name}
                </option>
              ))}
            </select>
          </div>

          {/* Coordinator Dropdown */}
          <div>
            <label>Coordinator</label>

            <select
              value={selectedCoordinatorId}
              onChange={(e) => handleCoordinatorChange(e.target.value)}
              className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white"
            >
              <option value="">Select Coordinator</option>
              {coordinators.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Coordinator Number */}
          <div>
            <label>Coordinator No.</label>
            <input
              {...register("coordinator_number")}
              placeholder="10-digit number"
              className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500"
            />
          </div>

          {/* OPD Section */}
          {patientType === "OPD" && (
            <>
              <div>
                <label>Consultation Type</label>
                <select
                  {...register("consultation_type")}
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value)}
                  className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white"
                >
                  <option value="Online">Online</option>
                  <option value="Office">Office</option>
                </select>
              </div>

              {/* Hospital fields only if Office */}
              {consultationType === "Office" && (
                <>
                  <div>
                    <label>Hospital Name</label>

                    <select
                      value={selectedHospitalId}
                      onChange={(e) => handleHospitalChange(e.target.value)}
                      className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white"
                    >
                      <option value="">Select Hospital</option>
                      {hospitals.map((h) => (
                        <option key={h._id} value={h._id}>
                          {h.hospital_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Hospital Address</label>
                    <input
                      {...register("hospital_address")}
                      placeholder="Hospital Address"
                      className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label>OP Time</label>
                <input
                  {...register("op_time")}
                  type="time"
                  className="w-full border border-gray-600 p-2 rounded-md"
                />
              </div>
              <div>
                <label>OP Date</label>
                <input
                  {...register("op_date")}
                  type="date"
                  className="w-full border border-gray-600 p-2 rounded-md"
                />
              </div>
            </>
          )}

          {/* IPD Section */}
          {patientType === "IPD" && (
            <>
              <div>
                <label>Surgery Date</label>
                <input
                  {...register("surgery_date")}
                  type="date"
                  className="w-full border border-gray-600 p-2 rounded-md"
                />
              </div>
              <div>
                <label>Admission Time</label>
                <input
                  {...register("admission_time")}
                  type="time"
                  className="w-full border border-gray-600 p-2 rounded-md"
                />
              </div>
              <div>
                <label>OT Time</label>
                <input
                  {...register("ot_time")}
                  type="time"
                  className="w-full border border-gray-600 p-2 rounded-md"
                />
              </div>
              <div>
                <label>Hospital Name</label>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => handleHospitalChange(e.target.value)}
                  className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white"
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.hospital_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Hospital Address</label>
                <input
                  {...register("hospital_address")}
                  placeholder="Hospital Address"
                  className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500"
                />
              </div>
            </>
          )}

          {/* Payment */}
          <div>
            <label>Amount</label>
            <input
              {...register("amount")}
              type="number"
              placeholder="Amount"
              className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500"
            />
          </div>
          <div>
            <label>Payment Mode</label>
            <select
              {...register("payment_mode")}
              className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white"
            >
              {patientType === "OPD" ? (
                <>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="NetBanking">Net Banking</option>
                </>
              ) : (
                <>
                  <option value="Cash">Cash</option>
                  <option value="Reimbursement">Reimbursement</option>
                  <option value="EMI">EMI</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label>Status</label>
            <select
              {...register("status")}
              className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white"
            >
              <option value="">Select Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-3 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onclose}
              className="border border-gray-600 px-4 py-1.5 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-1.5 rounded-md text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-select_layout-dark hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointment;
