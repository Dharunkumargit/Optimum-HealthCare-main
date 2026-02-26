import React, { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import OPD_Details from "../patients/OPD_Details";
import domtoimage from "dom-to-image-more";
import { PatientsData } from "../../../component/Data";

const ViewAppoinment = ({ onclose, data }) => {
  const [iscompleted, setIscompleted] = useState(true);
  const [isCreateInvoice, setIsCreateInvoice] = useState(false);
  const [isview, setIsview] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);
  const navigate = useNavigate();

  const handleCreateInvoiceClick = () => {
    setIsview(false);
    setIsCreateInvoice(true);
  };

  const handleCancelInvoiceClick = () => {
    setIsCreateInvoice(false);
    setIscompleted(true);
  };

  const exportRef = useRef();

  const handleDownload = () => {
    const element = exportRef.current;
    domtoimage
      .toPng(element, {
        style: {
          margin: 0,
          padding: 0,
          overflow: "visible",
        },
        height: element.scrollHeight,
        width: element.scrollWidth,
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `_OPD_Details.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Download failed:", error);
      });
  };

  return (
    <div className="font-layout-font fixed inset-0 flex justify-center items-center backdrop-blur-sm z-10">
      <div className="dark:bg-layout-dark bg-layout-light rounded-lg drop-shadow-md dark:text-white w-fit h-fit">
        {isview && (
          <>
            <p
              className="grid place-self-end -mx-4 -my-4 dark:bg-layout-dark bg-layout-light shadow-sm py-2.5 px-2.5 rounded-full"
              onClick={onclose}
            >
              <IoClose className="size-[20px]" />
            </p>
            <div className="grid justify-center px-8 py-4 gap-6">
              <p className="text-center font-semibold text-lg">
                View Appointment
              </p>
              <div
                ref={exportRef}
                style={{
                  maxHeight: "700px",
                }}
                className="m-2  border rounded-2xl overflow-y-auto no-scrollbar dark:bg-layout-dark bg-white"
              >
                <OPD_Details patient={data} />
              </div>
            </div>
            <div className="flex justify-end items-center gap-4 my-4 mx-6 text-sm font-normal">
              <p
                className="cursor-pointer border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
                onClick={onclose}
              >
                Cancel
              </p>
              <button
                onClick={handleDownload}
                className="cursor-pointer border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
              >
                Download
              </button>

              {/* Show Create Invoice button only if status is Completed */}
              {data.status === "Completed" && (
                <p
                  className="cursor-pointer bg-select_layout-dark px-6 py-1.5 rounded-sm"
                  onClick={() => {
                    setIsview(false);
                    handleCreateInvoiceClick;
                    setIsCreateInvoice(true);
                    // Optionally, you can also pass the data to the invoice modal here
                    setInvoiceData(data); // <-- add a state for prefilled invoice data
                  }}
                >
                  Create Invoice
                </p>
              )}
            </div>
          </>
        )}

        {isCreateInvoice && invoiceData && (
          <>
            <p
              className="grid place-self-end -mx-4 -my-4 dark:bg-layout-dark bg-layout-light shadow-sm py-2.5 px-2.5 rounded-full"
              onClick={onclose}
            >
              <IoClose className="size-[20px]" />
            </p>
            <div className="grid justify-center px-8 py-4 gap-6">
              <p className="text-center font-semibold text-lg">
                Create Invoice
              </p>
              <div className="p-2">
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Name</label>
                    <input
                      type="text"
                      className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm"
                      defaultValue={invoiceData.patient_name} // prefilled
                    />
                  </div>
                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Phone number</label>
                    <input
                      type="text"
                      className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm"
                      defaultValue={invoiceData.coordinator_number} // prefilled
                    />
                  </div>
                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Date</label>
                    <input
                      type="date"
                      className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm"
                      defaultValue={invoiceData.op_date} // prefilled
                    />
                  </div>

                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Slot</label>
                    <input
                      type="time"
                      className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm"
                      defaultValue={invoiceData.op_time} // prefilled
                    />
                  </div>
                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Doctor</label>
                    <input
                      type="text"
                      className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm"
                      defaultValue={invoiceData.surgeon_name} // prefilled
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="flex justify-end items-center gap-4 my-4 mx-6 text-sm font-normal">
              <p
                className="cursor-pointer border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
                onClick={handleCancelInvoiceClick}
              >
                Cancel
              </p>
              <p
                className="cursor-pointer bg-select_layout-dark px-6 py-1.5 rounded-sm"
                onClick={() => {
                  navigate("/appointment/invoice", {
                    state: { invoiceData }, // <-- pass invoice data here
                  });
                }}
              >
                Create
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAppoinment;
