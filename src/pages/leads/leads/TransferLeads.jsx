import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { API } from "../../../Constant";
import { toast } from "react-toastify";

// Validation schema
const schema = yup.object().shape({
  selectedLeadIds: yup
    .array()
    .min(1, "At least one lead must be selected.")
    .required("Select at least one lead."),
  bdname: yup.string().required("Please select a BD name."),
});

const TransferLeads = ({
  onclose,
  bdNames,
  selectedLeads,
  onSave,
  fetchLeads,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedLeadIds: selectedLeads.map((lead) => lead.leadId),
      bdname: "",
    },
  });

  const selectedLeadIds = watch("selectedLeadIds");

  const toggleCheckbox = (leadId) => {
    const current = selectedLeadIds || [];
    const updated = current.includes(leadId)
      ? current.filter((id) => id !== leadId)
      : [...current, leadId];
    setValue("selectedLeadIds", updated);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        leadIds: selectedLeads.map((lead) => lead.lead_id), // array of lead IDs
        bdname: data.bdname, // selected BD name
      };

      const response = await axios.put(`${API}/lead/transferleads`, payload);
      toast.success(response.data.message || "Leads transferred successfully");
      fetchLeads();
      onSave(payload); // call parent handler if needed
      onclose(); // close modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to transfer leads");
    }
  };

  return (
    <div className="font-layout-font fixed inset-0 grid z-20 justify-center items-center backdrop-blur-xs">
      <div className="mx-2 p-4 shadow-lg dark:bg-popup-gray bg-layout-light dark:bg-layout-dark rounded-lg  relative">
        <div className="grid p-4 text-layout_text-light dark:text-layout_text-dark">
          <button
            onClick={onclose}
            className="place-self-end dark:bg-popup-gray bg-white dark:bg-layout-dark absolute rounded-full -top-5 -right-4 lg:shadow-md md:shadow-md shadow-none lg:py-3 md:py-3 py-0 lg:px-3 md:px-3 px-0"
          >
            <IoClose className="size-[24px]" />
          </button>

          <h1 className="text-center font-semibold text-xl py-2 mb-4 dark:text-white text-black">
            Transfer Leads
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 space-y-2 gap-4 dark:text-white text-black"
          >
            <div className="col-span-2 flex gap-4">
              <label className="mb-2 block mt-2">Selected Leads</label>
              <div className="max-h-40 w-72 overflow-y-auto no-scrollbar border border-[#454545] rounded-md p-2 space-y-1">
                {selectedLeads.map((lead ,i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={selectedLeadIds?.includes(lead.leadId)}
                      onChange={() => toggleCheckbox(lead.leadId)}
                    />
                    <span>
                      {lead.name} ({lead.leadId})
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {errors.selectedLeadIds && (
              <p className="text-red-500 text-sm col-span-2">
                {errors.selectedLeadIds.message}
              </p>
            )}

            <div className="flex col-span-2 gap-5 justify-between items-center">
              <label className="">Transfer to</label>
              <Controller
                name="bdname"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="p-2  rounded-md w-72 bg-transparent border border-[#454545] text-black dark:text-white dark:bg-transparent"
                  >
                    <option value="" className="text-black">
                      Select BD Name
                    </option>
                    {bdNames.map((name) => (
                      <option className="text-black" key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            {errors.transferTo && (
              <p className="text-red-500 text-sm col-span-2">
                {errors.transferTo.message}
              </p>
            )}

            <div className="w-full flex justify-end items-center gap-4 mt-4 mr-6 text-sm font-normal col-span-2">
              <p
                onClick={onclose}
                className="cursor-pointer border border-select_layout-dark text-select_layout-dark px-6 py-1.5 rounded-sm"
              >
                Cancel
              </p>
              <button
                type="submit"
                className="cursor-pointer bg-select_layout-dark dark:text-black text-white px-6 py-1.5 rounded-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferLeads;
