import React from "react";

const IndicatorCard = ({ icon, label, value, progress }) => {
  return (
    <div className="flex items-center gap-2 p-4 rounded-xl dark:text-white">
      <div className="text-blue-600  p-2 rounded-md bg-[#D5CAFF]">{icon}</div>
      <div className=" w-full ">
        <div className="flex items-center text-xl font-bold">
          <div className=" w-full bg-white rounded-full h-2 mt-2 ">
            <div
              className="bg-select_layout-dark h-2  rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center mt-1 mx-1">{value}</div>
        </div>
        <div className="text-sm font-semibold mx-1">{label}</div>
      </div>
    </div>
  );
};
export default IndicatorCard;
