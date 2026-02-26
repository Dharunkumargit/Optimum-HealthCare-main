import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";

// Validation schema
const schema = yup.object().shape({
  channelName: yup.string().required("Channel Name is required"),
  channel: yup.string().required("Channel is required"),
  startDate: yup.string(),
  endDate: yup.string(),
  budget: yup.number().typeError("Budget must be a number").required("Budget is required").positive("Budget must be positive"),
  campaignId: yup.string(),
});

const CreateCampaign = ({ onclose }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    
    setLoading(true);
    try {
      await axios.post(`${API}/campaign/create`, data);
      toast.success("Campaign created successfully");
      onclose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-layout-font fixed inset-0 grid z-20 justify-center items-center backdrop-blur-xs">
      <div className="mx-2 p-4 shadow-lg dark:bg-popup-gray bg-layout-light dark:bg-layout-dark rounded-lg drop-shadow-2xl lg:w-[500px] md:w-[500px] w-96 relative">
        <div className="grid p-4 text-layout_text-light dark:text-layout_text-dark">
          <button
            onClick={onclose}
            className="place-self-end dark:bg-popup-gray bg-white dark:bg-layout-dark absolute rounded-full -top-5 -right-4 lg:shadow-md md:shadow-md shadow-none lg:py-3 md:py-3 py-0 lg:px-3 md:px-3 px-0"
          >
            <IoClose className="size-[24px]" />
          </button>

          <h1 className="text-center font-semibold text-xl py-2 mb-4 dark:text-white text-black">
            Create Campaign
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 space-y-2 gap-4 dark:text-white text-black">
            {/* Channel Name */}
            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="font-medium">Campaign Name</label>
              <input
                type="text"
                placeholder="Channel"
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
                {...register("channelName")}
              />
              {errors.channelName && <p className="mt-0.5 text-xs text-red-500">{errors.channelName.message}</p>}
            </div>

            {/* Channel */}
            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="font-medium">Channel</label>
              <input
                type="text"
                placeholder="Channel"
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
                {...register("channel")}
              />
              {errors.channel && <p className="mt-0.5 text-xs text-red-500">{errors.channel.message}</p>}
            </div>

            {/* Budget */}
            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="font-medium">Campaign Id</label>
              <input
                type="text"
                placeholder="campaignId "
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
                {...register("campaignId")}
              />
              {errors.campaignId && <p className="mt-0.5 text-xs text-red-500">{errors.campaignId.message}</p>}
            </div>
            {/* Start Date */}
            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="font-medium">Start Date</label>
              <input
                type="date"
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
                {...register("startDate")}
              />
              {errors.startDate && <p className="mt-0.5 text-xs text-red-500">{errors.startDate.message}</p>}
            </div>

            {/* End Date */}
            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="font-medium">End Date</label>
              <input
                type="date"
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
                {...register("endDate")}
              />
              {errors.endDate && <p className="mt-0.5 text-xs text-red-500">{errors.endDate.message}</p>}
            </div>


            {/* Budget */}
            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="font-medium">Budget</label>
              <input
                type="number"
                placeholder="Budget"
                className="p-2 rounded-md w-72 bg-transparent border border-gray-600 dark:placeholder:text-white placeholder:text-black"
                {...register("budget")}
              />
              {errors.budget && <p className="mt-0.5 text-xs text-red-500">{errors.budget.message}</p>}
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-end items-center gap-4 mt-4 mr-6 text-sm font-normal">
              <p
                onClick={onclose}
                className={`cursor-pointer border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Cancel
              </p>
              <button
                type="submit"
                className={`cursor-pointer bg-select_layout-dark dark:text-black text-white px-6 py-1.5 rounded-sm ${loading ? "bg-gray-500 cursor-not-allowed" : ""}`}
                disabled={loading}
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

export default CreateCampaign;
