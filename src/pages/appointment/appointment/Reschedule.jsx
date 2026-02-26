import React from "react";
import { IoClose } from "react-icons/io5";

const Reschedule = ({ onclose }) => {

  return (
    <div className=" font-layout-font fixed inset-0 flex justify-center items-center backdrop-blur-sm z-10">
         <div className="dark:bg-layout-dark bg-layout-light rounded-lg drop-shadow-md dark:text-white w-fit h-fit">
           <p
             className="grid place-self-end -mx-4 -my-4 dark:bg-layout-dark bg-layout-light shadow-sm  py-2.5 px-2.5 rounded-full"
             onClick={onclose}
           >
             <IoClose className="size-[20px]" />
           </p>
           <div className="grid justify-center px-8 py-4 gap-6">
             <p className="text-center font-semibold text-lg">Reschedule Appointments</p>
             <div className="p-2">
               <form className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div className="flex  col-span-2 justify-between items-center">
                   <label className=" font-medium col-span-1">
                    Token No
                   </label>
                   <p className="p-2 rounded-md w-52 bg-transparent col-span-1  text-sm">
                   #2345</p>
                 </div>
                 <div className="flex  col-span-2 justify-between items-center">
                   <label className="  font-medium col-span-1">
                     Name
                   </label>
                   <p className="p-2 rounded-md w-52 bg-transparent col-span-1   text-sm">
                   Dinesh Kumar</p>
                 </div>
                 <div className="flex  col-span-2 justify-between items-center gap-10">
                   <label className="  font-medium col-span-1">
                     Phone number
                   </label>
   
                   <p className="p-2 rounded-md w-52 bg-transparent col-span-1  text-sm">
                     7550378859
                   </p>
                 </div>
                 <div className="flex col-span-2 justify-between items-center">
                   <label className="  font-medium col-span-1">
                     Email ID
                   </label>
                   <p className="p-2 rounded-md w-52 bg-transparent  col-span-1   text-sm">
                     vishva2202005@gamil.com
                   </p>
                 </div>{" "}
                 <div className="flex col-span-2 justify-between items-center">
                   <label className="  font-medium col-span-1">
                     Date
                   </label>
                   <p className="p-2 rounded-md w-52 bg-transparent  col-span-1   text-sm">
                     10.04.2025
                   </p>
                 </div>
                 <div className="flex col-span-2 justify-between items-center">
                   <label className="  font-medium col-span-1">
                     Age
                   </label>
                   <p className="p-2 rounded-md w-52 bg-transparent  col-span-1   text-sm">
                     18
                   </p>
                 </div>
                 <div className="flex col-span-2 justify-between items-center">
                   <label className="  font-medium col-span-1">
                     Slot
                   </label>
                   <p className="p-2 rounded-md w-52 bg-transparent  col-span-1   text-sm">
                     6
                   </p>
                 </div>
                 <div className="flex col-span-2 justify-between items-center">
                   <label className="  font-medium col-span-1">
                     Doctor
                   </label>
                   <p className="p-2 rounded-md w-52 bg-transparent col-span-1  text-sm">
                     13
                   </p>
                 </div>
                 <div className="flex sm:col-span-2 justify-between items-center">
                   <label className="  font-medium col-span-1">
                     Status
                   </label>
                   <p className="p-2 rounded-md w-52 bg-transparent col-span-1   text-sm">
                     active
                   </p>
                 </div>
               </form>
             </div>
           </div>
           <div className="flex justify-end items-center gap-4 my-4 mx-6 text-sm font-normal">
             <p
               className="cursor-pointer border border-select_layout-dark text-select_layout-dark  px-6 py-1.5 rounded-sm"
               onClick={onclose}
             >
               Cancel
             </p>
             <p
               className="cursor-pointer bg-select_layout-dark   px-6 py-1.5 rounded-sm"
               onClick={onclose}
             >
            Reschedule Appointment
             </p>
         
           </div>
         </div>
       </div>
  );
};

export default Reschedule;
