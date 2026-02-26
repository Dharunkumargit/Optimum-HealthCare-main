import React, { useState } from "react";
import Logo from "../../../assets/images/icon.png";
import Logo_L from "../../../assets/images/Logo(light).png";
import Logo_D from "../../../assets/images/Logo(dark).png";
import { PatientsData } from "../../../component/Data";
const OPD_Details = ({ patient }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      id="opd-receipt"
      className=" w-[800px] h-[500px] space-y-0 text-black m-0 px-2 py-4 rounded-2xl font-sans text-sm border-none dark:text-white dark:bg-layout-dark bg-white overflow-visible"
    >
      {/* Header */}
      <div className="text-center pb-4 flex flex-col items-center w-full border-none  dark:bg-layout-dark bg-white">
        {!open ? (
          <>
            <img
              src={Logo_L}
              alt="logo"
              className="w-32 dark:hidden border-none"
            />
            <img
              src={Logo_D}
              alt="logo"
              className="hidden dark:block w-32 border-none"
            />
          </>
        ) : (
          <img src={Logo} alt="logo" className="w-32 border-none" />
        )}
        <p className="border-black border-y w-full  py-1 border-x-0">
          <span className="font-bold text-base  border-none  dark:border-white ">
            {patient.patient_type} DETAILS
          </span>
        </p>
      </div>

      <div className=" py-5 border-none -mt-6">
        {/* Table */}
        <table className="w-full border-none text-[13px]">
          <tbody className="border-none">
            {[
              ["Patient Name", patient.patient_name],
              ["Age", patient.age],
              ["Gender", patient.gender],
              ["Treatment", patient.treatment],
              ["Consultation Type", patient.consultation_type],
              [
                "OP Time & Date",
                patient.op_time || patient.op_date
                  ? `${patient.op_time} ${patient.op_date}`
                  : null,
              ],
              ["City", patient.city],
              ["Surgeon Name", patient.surgeon_name],
              ["Hospital Name", patient.hospital_name],
              ["Hospital Address", patient.hospital_address],
              [
                "Amount to be Paid",
                patient.amount ? `₹ ${patient.amount}` : null,
              ],
              ["Payment Mode", patient.payment_mode],
              ["Medical Coordinator", patient.medical_coordinator],
              ["Pt Number", patient.coordinator_number],
            ]
              .filter(([label, value]) => value) // Only include rows with actual data
              .map(([label, value], index) => (
                <tr key={index} className="border-none">
                  <td className="border border-black p-2 font-semibold align-top">
                    {label}
                  </td>
                  <td className="border border-black p-2 align-top">{value}</td>
                </tr>
              ))}

            {/* Footer Row */}
            <tr className="border-none">
              <td
                colSpan={2}
                className=" p-2 text-center border-none text-blue-500 underline font-medium"
              >
                Optimumhealth.in
              </td>
            </tr>
            <tr>
              <td>Oral fasting must be at least 8 hours before tests.</td>
              <td>Report any unusual symptoms immediately.</td>
              {/* <li>Drink plenty of water unless instructed otherwise.</li>
                  <li>Bring previous medical reports and prescriptions.</li>
                  <li>Take medicines only as prescribed by your doctor.</li>
                  <li>
                    Inform your doctor of any allergies or ongoing medications.
                  </li>
                  <li>
                    Avoid strenuous activity before lab tests or procedures.
                  </li>
                  <li>
                    Follow hygiene instructions strictly (mask, sanitizer,
                    etc.).
                  </li>
                  <li>Report any unusual symptoms immediately.</li> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OPD_Details;
