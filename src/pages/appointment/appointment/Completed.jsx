import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Completed = ({ onclose }) => {
  const [iscompleted, setIscompleted] = useState(true);
  const [isCreateInvoice, setIsCreateInvoice] = useState(false);
  const navigate = useNavigate();

  const handleCreateInvoiceClick = () => {
    setIscompleted(false);
    setIsCreateInvoice(true);
  };

  const handleCancelInvoiceClick = () => {
    setIsCreateInvoice(false);
    setIscompleted(true);
  };

  return (
    <div className="font-layout-font fixed inset-0 flex justify-center items-center backdrop-blur-sm z-10">
      <div className="dark:bg-layout-dark bg-layout-light rounded-lg drop-shadow-md dark:text-white w-fit h-fit">
        {iscompleted && (
          <>
            <p
              className="grid place-self-end -mx-4 -my-4 dark:bg-layout-dark bg-layout-light shadow-sm py-2.5 px-2.5 rounded-full"
              onClick={onclose}
            >
              <IoClose className="size-[20px]" />
            </p>
            <div className="grid justify-center px-8 py-4 gap-6">
              <p className="text-center font-semibold text-lg">Completed Appointments</p>
              <div className="p-2">
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex col-span-2 justify-between items-center">
                    <label className="font-medium">Token No</label>
                    <p className="p-2 rounded-md w-52 bg-transparent text-sm">#2345</p>
                  </div>
                  <div className="flex col-span-2 justify-between items-center">
                    <label className="font-medium">Name</label>
                    <p className="p-2 rounded-md w-52 bg-transparent text-sm">Dinesh Kumar</p>
                  </div>
                  <div className="flex col-span-2 justify-between items-center">
                    <label className="font-medium">Phone number</label>
                    <p className="p-2 rounded-md w-52 bg-transparent text-sm">7550378859</p>
                  </div>
                  <div className="flex col-span-2 justify-between items-center">
                    <label className="font-medium">Email ID</label>
                    <p className="p-2 rounded-md w-52 bg-transparent text-sm">vishva2202005@gamil.com</p>
                  </div>
                  <div className="flex col-span-2 justify-between items-center">
                    <label className="font-medium">Date</label>
                    <p className="p-2 rounded-md w-52 bg-transparent text-sm">10.04.2025</p>
                  </div>
                  <div className="flex col-span-2 justify-between items-center">
                    <label className="font-medium">Age</label>
                    <p className="p-2 rounded-md w-52 bg-transparent text-sm">18</p>
                  </div>
                  <div className="flex col-span-2 justify-between items-center">
                    <label className="font-medium">Slot</label>
                    <p className="p-2 rounded-md w-52 bg-transparent text-sm">6</p>
                  </div>
                  <div className="flex col-span-2 justify-between items-center">
                    <label className="font-medium">Doctor</label>
                    <p className="p-2 rounded-md w-52 bg-transparent text-sm">13</p>
                  </div>
                  <div className="flex sm:col-span-2 justify-between items-center">
                    <label className="font-medium">Status</label>
                    <p className="p-2 rounded-md w-52 bg-transparent text-sm">active</p>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex justify-end items-center gap-4 my-4 mx-6 text-sm font-normal">
              <p
                className="cursor-pointer border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
                onClick={onclose}
              >
                Cancel
              </p>
              <p
                className="cursor-pointer bg-select_layout-dark px-6 py-1.5 rounded-sm"
                onClick={handleCreateInvoiceClick}
              >
                Create Invoice
              </p>
            </div>
          </>
        )}

        {isCreateInvoice && (
          <>
            <p
              className="grid place-self-end -mx-4 -my-4 dark:bg-layout-dark bg-layout-light shadow-sm py-2.5 px-2.5 rounded-full"
              onClick={onclose}
            >
              <IoClose className="size-[20px]" />
            </p>
            <div className="grid justify-center px-8 py-4 gap-6">
              <p className="text-center font-semibold text-lg">Create Invoice</p>
              <div className="p-2">
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Name</label>
                    <input type="text" className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm" />
                  </div>
                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Phone number</label>
                    <input type="text" className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm" />
                  </div>
                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Date</label>
                    <input type="date" className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm" />
                  </div>
                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Slot</label>
                    <input type="number" className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm" />
                  </div>
                  <div className="flex gap-2 col-span-2 justify-between items-center">
                    <label className="font-medium">Doctor</label>
                    <input type="number" className="p-2 border rounded-md w-52 dark:border-layout_text-dark border-layout_text-light bg-transparent text-sm" />
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
                onClick={()=>{navigate('/appointment/invoice')}}
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

export default Completed;
