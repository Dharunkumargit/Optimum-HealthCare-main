import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import Logo_L from "../../assets/images/Logo(light).png";
import Logo_D from "../../assets/images/Logo(dark).png";
import { IoEyeOff, IoEye } from "react-icons/io5";
import ThemeToggle from "../../component/ThemeToggle";
import { API } from "../../Constant";
import { toast } from "react-toastify";

// ✅ Yup validation schema
const loginSchema = Yup.object().shape({
  identifier: Yup.string().required("Email or phone is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // // Get user location on mount
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => {
  //         setLocation({
  //           lat: pos.coords.latitude,
  //           lng: pos.coords.longitude,
  //         });
  //       },
  //       (err) => {
  //         console.warn("Location not available:", err.message);
  //         setLocation(null);
  //       },
  //       { enableHighAccuracy: true }
  //     );
  //   }
  // }, []);
  useEffect(() => {
  const getIPLocation = async () => {
    try {
      // Free IP geolocation API - 1000 req/day
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      
      setLocation({
        lat: data.latitude,
        lng: data.longitude,
        city: data.city,  // Bonus: city name for Chennai
      });
      
      console.log('IP Location:', data.city, data.latitude, data.longitude);
    } catch (err) {
      console.warn('IP location failed:', err);
      setLocation(null);
    }
  };
  
  getIPLocation();
}, []);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    console.log(location);

    if (!location) {
      alert("Location is required for login");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/employee/login`, {
        ...data,
        location, // send user location automatically
      });

      toast.success("Login Succesfully");

      localStorage.setItem("employee", JSON.stringify(res.data.employee));

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative font-layout-font flex flex-col justify-center items-center gap-6 dark:bg-overall_bg-dark bg-overall_bg-light h-screen">
      <div className="right-8 absolute top-6 bg-layout-light dark:bg-layout-dark p-1 rounded-full">
        <ThemeToggle />
      </div>

      <div className="dark:bg-layout-dark bg-layout-light dark:text-white text-black w-full max-w-lg p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center py-4">
          <div>
            <img src={Logo_D} alt="Logo" className="w-44 hidden dark:block" />
            <img src={Logo_L} alt="Logo" className="w-44 dark:hidden" />
          </div>
          <p className="text-3xl font-bold text-center my-4">Login</p>
        </div>

        <form className="mx-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="grid mb-4">
            Email / Phone Number
            <input
              type="text"
              {...register("identifier")}
              className="border-2 dark:border-overall_bg-dark border-[#D0D6FF] outline-none rounded-md py-2 px-2 my-1"
              placeholder="Enter email or phone number"
            />
            {errors.identifier && (
              <span className="text-red-500 text-sm mt-1">
                {errors.identifier.message}
              </span>
            )}
          </label>

          <label className="grid relative">
            Password
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="border-2 dark:border-overall_bg-dark border-[#D0D6FF] outline-none rounded-md py-2 px-2 pr-10"
              placeholder="Enter password"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer dark:text-gray-400 text-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </span>
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </label>

          <button
            type="submit"
            className="cursor-pointer bg-select_layout-dark text-black text-center w-full py-2 my-3 rounded-md text-lg font-semibold transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
