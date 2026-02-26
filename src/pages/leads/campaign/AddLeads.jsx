import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../Constant";

// ✅ Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  gender: yup.string().required("Gender is required"),
  source: yup.string().required("Source is required"),
  // status: yup.string().required("Lead status is required"),
  treatment: yup.string().required("Treatment is required"),
  age: yup.string().required("Age is required"),
  weight: yup.string().required("Weight is required"),
  circle: yup.string().required("Circle is required"),
  notes: yup.string(),
});

const AddLeads = ({ onclose, campaignId1, fetchCampaignDetails, Platform }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // ✅ Autofill source from platform
    if (Platform) {
      setValue("source", Platform);
    }
  }, [Platform, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, campaign_id: campaignId1 }; // lead ID if needed
      await axios.post(`${API}/lead/add`, payload);

      fetchCampaignDetails(); // Refresh data
      toast.success("Lead created successfully");
      onclose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 grid place-items-center backdrop-blur-sm">
      <div className="relative w-full max-w-3xl p-6 rounded-lg bg-layout-light dark:bg-layout-dark dark:text-white shadow-lg">
        <button
          onClick={onclose}
          className="absolute -top-4 -right-4 p-2 rounded-full shadow-md bg-white dark:bg-layout-dark"
        >
          <IoClose size={22} />
        </button>

        <h1 className="text-center text-2xl font-semibold mb-6 text-black dark:text-white">
          Create Lead
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black dark:text-white"
        >
          {/* Name */}
          <div>
            <label className="font-medium">Name</label>
            <input
              type="text"
              placeholder="Lead Name"
              {...register("name")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="font-medium">Phone</label>
            <input
              type="text"
              placeholder="Phone"
              {...register("phone")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>
          {/* Gender */}
          <div>
            <label className="font-medium">Gender</label>
            <select
              {...register("gender")}
              className="p-2 w-full rounded-md border border-gray-600 bg-layout-light dark:bg-layout-dark dark:text-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* Treatment */}
          <div>
            <label className="font-medium">Treatment</label>
            <input
              type="text"
              placeholder="Treatment"
              {...register("treatment")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.treatment && (
              <p className="text-xs text-red-500">{errors.treatment.message}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="font-medium">Age</label>
            <input
              type="text"
              placeholder="Age"
              {...register("age")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.age && (
              <p className="text-xs text-red-500">{errors.age.message}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="font-medium">Weight</label>
            <input
              type="text"
              placeholder="Weight"
              {...register("weight")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.weight && (
              <p className="text-xs text-red-500">{errors.weight.message}</p>
            )}
          </div>

          {/* Circle */}
          <div>
            <label className="font-medium">City</label>
            <input
              type="text"
              placeholder="City"
              {...register("circle")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.circle && (
              <p className="text-xs text-red-500">{errors.circle.message}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Source */}
          <div>
            <label className="font-medium">Source</label>
            <input
              type="text"
              placeholder="Source"
              {...register("source")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
            {errors.source && (
              <p className="text-xs text-red-500">{errors.source.message}</p>
            )}
          </div>

          {/* Status
          <div>
            <label className="font-medium">Lead Status</label>
            <select
              {...register("status")}
              className="p-2 w-full rounded-md border border-gray-600 bg-layout-light dark:bg-layout-dark dark:text-white"
            >
              <option value="">Select</option>
              <option value="new">New</option>
              <option value="follow-up">Follow-up</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div> */}

          {/* Notes */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <label className="font-medium">Notes</label>
            <textarea
              rows={4}
              placeholder="Notes"
              {...register("notes")}
              className="p-2 w-full border rounded-md bg-transparent border-gray-600"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onclose}
              className="border px-6 py-2 rounded-md border-gray-600 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-select_layout-dark text-white"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeads;
