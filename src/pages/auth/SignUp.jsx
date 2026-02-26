import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo_L from "../../assets/images/Logo(light).png";
import Logo_D from "../../assets/images/Logo(dark).png";
import ThemeToggle from "../../component/ThemeToggle";

const SignUp = () => {
  const navigate = useNavigate();


  return (
    <>
      <div className="relative font-layout-font flex flex-col justify-center items-center gap-6 dark:bg-overall_bg-dark bg-overall_bg-light  h-screen ">
        <div className=" right-8 absolute top-6 bg-layout-light dark:bg-layout-dark p-1 rounded-full">
          <ThemeToggle />
        </div>
        <div className="dark:bg-layout-dark bg-layout-light dark:text-white text-black w-full max-w-lg p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center py-4">
            <div>
              <img src={Logo_D} alt="Logo" className="w-44 hidden dark:block" />
              <img src={Logo_L} alt="Logo" className="w-44 dark:hidden" />
            </div>
            <p className="text-3xl font-bold text-center my-4">Register</p>
          </div>
          <form className="mx-4 mt-4">
          <label className="grid  mb-4">
              Name
              <input
                type="text"
                className=" border-2 dark:border-overall_bg-dark border-[#D0D6FF] outline-none rounded-md py-2 px-2 my-1"
                placeholder="Enter name"
              />
            </label>
            <label className="grid  mb-4">
              Email ID
              <input
                type="email"
                className=" border-2 dark:border-overall_bg-dark border-[#D0D6FF] outline-none rounded-md py-2 px-2 my-1"
                placeholder="Enter email "
              />
            </label>
            <label className="grid  mb-4">
            Phone Number
              <input
                type="text"
                className=" border-2 dark:border-overall_bg-dark border-[#D0D6FF] outline-none rounded-md py-2 px-2 my-1"
                placeholder="Enter phone number"
              />
            </label>
            <p
              onClick={() => navigate("/")}
              className=" cursor-pointer bg-select_layout-dark text-black text-center   w-full py-2 my-5 rounded-md text-lg font-semibold transition duration-200 "
            >
              Signup
            </p>
          </form>
          <p className="text-center cursor-pointer text-sm py-4">
            Already have an account? <span   onClick={() => navigate("/login")}  className=" hover:underline font-semibold">Login</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
