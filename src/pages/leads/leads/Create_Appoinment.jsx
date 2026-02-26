import React, { useEffect, useState } from "react";
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
});

const Create_Appointment = ({ onclose, lead }) => {
  const [loading, setLoading] = useState(false);
  const [consultationType, setConsultationType] = useState("Online");
  const [patientType, setPatientType] = useState("OPD");
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [autoFilledFields, setAutoFilledFields] = useState(new Set()); // Track autofilled fields

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 🔹 Check if field is autofilled from lead
  const isAutoFilled = (fieldName) => autoFilledFields.has(fieldName);

  // 🔹 Autofill form from lead data
  useEffect(() => {
    if (lead) {
      const filledFields = new Set();
      
      if (lead.patient_name || lead.name) {
        setValue("patient_name", lead.patient_name || lead.name || "");
        filledFields.add("patient_name");
      }
      if (lead.age) {
        setValue("age", lead.age);
        filledFields.add("age");
      }
      if (lead.treatment) {
        setValue("treatment", lead.treatment);
        filledFields.add("treatment");
      }
      if (lead.gender) {
        setValue("gender", lead.gender);
        filledFields.add("gender");
      }
      if (lead.circle) {
        setValue("city", lead.circle);
        filledFields.add("city");
      }
      
      const leadPatientType = lead.patient_type || "OPD";
      setValue("patient_type", leadPatientType);
      setPatientType(leadPatientType);
      filledFields.add("patient_type");

      // Optional: prefill consultation_type if OPD
      if (leadPatientType === "OPD" && lead.consultation_type) {
        setConsultationType(lead.consultation_type);
        setValue("consultation_type", lead.consultation_type);
        filledFields.add("consultation_type");
      }
      
      setAutoFilledFields(filledFields);
    }
  }, [lead, setValue]);

  // 🔹 Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorRes, hospitalRes, coordinatorRes] = await Promise.all([
          axios.get(`${API}/doctor/getalldoctors`),
          axios.get(`${API}/hospital/getallhospitals`),
          axios.get(`${API}/employee/getallemployees`),
        ]);

        setDoctors(doctorRes.data.data || []);
        setHospitals(hospitalRes.data.data || []);
        setCoordinators(coordinatorRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleTypeChange = (type) => {
    setPatientType(type);
    setValue("patient_type", type);
  };

  const handleHospitalSelect = (id) => {
    const selected = hospitals.find((h) => h._id === id);
    if (selected) {
      setValue("hospital_name", selected.hospital_name);
      setValue("hospital_address", selected.address || "");
    }
  };

  const handleCoordinatorSelect = (id) => {
    const selected = coordinators.find((c) => c._id === id);
    if (selected) {
      setValue("medical_coordinator", selected.name);
      setValue("coordinator_number", selected.phone || "");
    }
  };

  const handleDoctorSelect = (id) => {
    const selected = doctors.find((d) => d._id === id);
    if (selected) {
      setValue("surgeon_name", selected.doctor_name);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        consultation_type: patientType === "OPD" ? consultationType : null,
        campaign_id: lead?.campaign_id,
        lead_id: lead?.lead_id,
      };

      await axios.post(`${API}/appointment/create`, payload);
      toast.success(`${patientType} appointment created successfully`);
      onclose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create appointment"
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
          Create Appointment
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">
          {/* Patient Type */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Patient Type</label>
            <select
              {...register("patient_type")}
              value={patientType}
              onChange={(e) => handleTypeChange(e.target.value)}
              disabled={isAutoFilled("patient_type")}
              className={`w-full border p-2 rounded-md bg-layout-dark text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isAutoFilled("patient_type")
                  ? "bg-gray-700 cursor-not-allowed border-gray-500 opacity-75"
                  : "border-gray-600 hover:border-gray-400"
              }`}
            >
              <option value="OPD">OPD</option>
              <option value="IPD">IPD</option>
            </select>
            {errors.patient_type && (
              <p className="text-red-500 text-xs mt-1">{errors.patient_type.message}</p>
            )}
          </div>

          {/* Patient Info */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Patient Name</label>
            <input
              {...register("patient_name")}
              placeholder="Full Name"
              readOnly={isAutoFilled("patient_name")}
              className={`w-full border p-2 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isAutoFilled("patient_name")
                  ? "bg-gray-100 dark:bg-gray-800 border-gray-400 cursor-not-allowed text-gray-700 dark:text-gray-300"
                  : "border-gray-600 hover:border-gray-500 bg-white dark:bg-layout-dark"
              }`}
            />
            {errors.patient_name && (
              <p className="text-red-500 text-xs mt-1">{errors.patient_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Age</label>
            <input
              {...register("age")}
              type="number"
              placeholder="Age"
              readOnly={isAutoFilled("age")}
              className={`w-full border p-2 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isAutoFilled("age")
                  ? "bg-gray-100 dark:bg-gray-800 border-gray-400 cursor-not-allowed text-gray-700 dark:text-gray-300"
                  : "border-gray-600 hover:border-gray-500 bg-white dark:bg-layout-dark"
              }`}
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Gender</label>
            <select
              {...register("gender")}
              disabled={isAutoFilled("gender")}
              className={`w-full border p-2 rounded-md bg-layout-dark text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isAutoFilled("gender")
                  ? "bg-gray-700 cursor-not-allowed border-gray-500 opacity-75"
                  : "border-gray-600 hover:border-gray-400"
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
            )}
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Treatment</label>
            <input
              {...register("treatment")}
              placeholder="Treatment"
              readOnly={isAutoFilled("treatment")}
              className={`w-full border p-2 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isAutoFilled("treatment")
                  ? "bg-gray-100 dark:bg-gray-800 border-gray-400 cursor-not-allowed text-gray-700 dark:text-gray-300"
                  : "border-gray-600 hover:border-gray-500 bg-white dark:bg-layout-dark"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">City</label>
            <input
              {...register("city")}
              placeholder="City"
              readOnly={isAutoFilled("city")}
              className={`w-full border p-2 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isAutoFilled("city")
                  ? "bg-gray-100 dark:bg-gray-800 border-gray-400 cursor-not-allowed text-gray-700 dark:text-gray-300"
                  : "border-gray-600 hover:border-gray-500 bg-white dark:bg-layout-dark"
              }`}
            />
          </div>

          {/* Surgeon Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Surgeon</label>
            <select
              onChange={(e) => handleDoctorSelect(e.target.value)}
              className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
            >
              <option value="">Select Surgeon</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.doctor_name}
                </option>
              ))}
            </select>
            <input
              {...register("surgeon_name")}
              placeholder="Surgeon Name"
              className="hidden"
            />
          </div>

          {/* Coordinator Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Coordinator</label>
            <select
              onChange={(e) => handleCoordinatorSelect(e.target.value)}
              className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
            >
              <option value="">Select Coordinator</option>
              {coordinators.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <input
              {...register("medical_coordinator")}
              placeholder="Coordinator Name"
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Coordinator No.</label>
            <input
              {...register("coordinator_number")}
              placeholder="10-digit number"
              className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 bg-white dark:bg-layout-dark"
            />
            {errors.coordinator_number && (
              <p className="text-red-500 text-xs mt-1">{errors.coordinator_number.message}</p>
            )}
          </div>

          {/* OPD / IPD Sections */}
          {patientType === "OPD" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Consultation</label>
                <select
                  {...register("consultation_type")}
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value)}
                  className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
                >
                  <option value="Online">Online</option>
                  <option value="Office">Office</option>
                </select>
              </div>

              {consultationType === "Office" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Hospital</label>
                    <select
                      onChange={(e) => handleHospitalSelect(e.target.value)}
                      className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
                    >
                      <option value="">Select Hospital</option>
                      {hospitals.map((h) => (
                        <option key={h._id} value={h._id}>
                          {h.hospital_name}
                        </option>
                      ))}
                    </select>
                    <input
                      {...register("hospital_name")}
                      placeholder="Hospital Name"
                      className="hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Hospital Address</label>
                    <input
                      {...register("hospital_address")}
                      placeholder="Hospital address"
                      className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 bg-white dark:bg-layout-dark"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">OP Time</label>
                <input
                  {...register("op_time")}
                  type="time"
                  className="w-full border border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 bg-white dark:bg-layout-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">OP Date</label>
                <input
                  {...register("op_date")}
                  type="date"
                  className="w-full border border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 bg-white dark:bg-layout-dark"
                />
              </div>
            </>
          )}

          {patientType === "IPD" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Surgery Date</label>
                <input
                  {...register("surgery_date")}
                  type="date"
                  className="w-full border border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 bg-white dark:bg-layout-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Admission Time</label>
                <input
                  {...register("admission_time")}
                  type="time"
                  className="w-full border border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 bg-white dark:bg-layout-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">OT Time</label>
                <input
                  {...register("ot_time")}
                  type="time"
                  className="w-full border border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 bg-white dark:bg-layout-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Hospital</label>
                <select
                  onChange={(e) => handleHospitalSelect(e.target.value)}
                  className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.hospital_name}
                    </option>
                  ))}
                </select>
                <input {...register("hospital_name")} className="hidden" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Hospital Address</label>
                <input
                  {...register("hospital_address")}
                  placeholder="Auto-filled address"
                  className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 bg-white dark:bg-layout-dark"
                />
              </div>
            </>
          )}

          {/* Payment */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Amount</label>
            <input
              {...register("amount")}
              type="number"
              placeholder="Amount"
              className="w-full border border-gray-600 p-2 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500 bg-white dark:bg-layout-dark"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Payment Mode</label>
            <select
              {...register("payment_mode")}
              className="w-full border border-gray-600 p-2 rounded-md bg-layout-dark text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
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

          {/* Buttons */}
          <div className="col-span-3 flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onclose}
              className="border border-gray-600 px-6 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-medium transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-select_layout-dark hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? "Saving..." : "Save Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create_Appointment;
