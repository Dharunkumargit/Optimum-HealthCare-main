import React from "react";

const appointments = [
  {
    id: "#24325",
    name: "John Doe",
    phone: "325-543-5674",
    doctor: "Dr. Mathew",
  },
  {
    id: "#24326",
    name: "Jane Smith",
    phone: "325-543-5675",
    doctor: "Dr. Mathew",
  },
  {
    id: "#24327",
    name: "Alex Johnson",
    phone: "325-543-5676",
    doctor: "Dr. Mathew",
  },
  {
    id: "#24328",
    name: "John Doe",
    phone: "325-543-5674",
    doctor: "Dr. Mathew",
  },
  {
    id: "#24329",
    name: "Jane Smith",
    phone: "325-543-5675",
    doctor: "Dr. Mathew",
  },
  {
    id: "#24330",
    name: "Alex Johnson",
    phone: "325-543-5676",
    doctor: "Dr. Mathew",
  },
];

const RecentAppointments = () => {
  return (
    <div className="dark:bg-layout-dark bg-layout-light p-4 rounded-xl dark:text-white">
      <h2 className="text-lg font-semibold mb-3">Today's Appointments</h2>
      <ul className="space-y-1 text-sm ">
        {appointments.map((appt) => (
          <li
            key={appt.id}
            className="flex justify-between border-b dark:border-layout-dark border-layout-light dark:bg-overall_bg-dark bg-overall_bg-light rounded-lg px-2 py-2 "
          >
            <div className="">
              <p>{appt.id}</p>
              <p className="dark:text-gray-100 font-extralight">
                {" "}
                <span className="font-semibold">Patient:</span> {appt.name}
              </p>
              <p className="dark:text-gray-100 font-extralight">
                <span className="font-semibold">Contact no:</span>
                {appt.phone}
              </p>
            </div>
            <p className=" font-extralight">
              <span className="font-semibold">Doctor:</span> {appt.doctor}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RecentAppointments;
