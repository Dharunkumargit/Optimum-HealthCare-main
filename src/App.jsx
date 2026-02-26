import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/layout/Layout";
import Login from "./pages/auth/Login";

import Leads from "./pages/leads/Leads";
import Finance from "./pages/finance/Finance";
import Report from "./pages/report/Report";
import Settings from "./pages/settings/Settings";
import AddRoleAccess from "./pages/settings/roles/AddRoleAcess";
import EditRoleAccess from "./pages/settings/roles/EditRoleAcess";

import ViewCampaign from "./pages/leads/campaign/ViewCampaign";
import ViewLeads from "./pages/leads/leads/ViewLeads";
import Invoice from "./pages/appointment/appointment/Invoice";
import Association from "./pages/association/Association";
import Hr from "./pages/hr/Hr";
// import Admin_Dashboard from "./pages/dashboard/new_dashboard/Admin_Dashboard";
// import Employee_Dashboard from "./pages/dashboard/new_dashboard/Employee_Dashboard";
import Dashboard_Tab from "./pages/dashboard/new_dashboard/Dashboard_Tab";
import Profile from "./pages/dashboard/profile/Profile";
import Tasks from "./pages/tasks/Tasks";
import ViewTasks from "./pages/tasks/ViewTasks";
import { ToastContainer } from "react-toastify";
import AutoLogout from "./pages/auth/AutoLogout";
import Appointment_Tab from "./pages/appointment/appointment/Appointment_Tab";
import Leads_Tab from "./pages/leads/leads/Leads_Tab";
import Campaign from "./pages/leads/campaign/Campaign";

const AppContent = () => {
  const { showWarning, warningCountdown, stayLoggedIn } = AutoLogout();

  return (
    <>
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md text-center w-80">
            <p className="text-lg font-semibold mb-2">
              You will be logged out soon!
            </p>
            <p className="mb-4">
              {warningCountdown} seconds remaining due to inactivity.
            </p>
            <button
              onClick={stayLoggedIn}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        {/* <Route path="/forgotpassword" element={<ForgotPassword />} /> */}

        {/* Protected routes inside Layout */}
        <Route path="/" element={<Layout />}>
          {" "}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/admin_dashboard" element={<Admin_Dashboard />} /> */}
          <Route path="/dashboard">
            <Route index element={<Dashboard_Tab />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/tasks">
            <Route index element={<Tasks />} />
            <Route path="viewtasks" element={<ViewTasks />} />
          </Route>
          <Route path="/appointment">
            <Route index element={<Appointment_Tab />} />
            <Route path="invoice" element={<Invoice />} />
          </Route>
          <Route path="/hr" element={<Hr />} />
          <Route path="/finance" element={<Finance />} />
          {/* <Route path="/editgmb" element={<EditGmbSet />} /> */}
          <Route path="/leads">
            <Route index element={<Leads_Tab />} />
            <Route path="viewleads" element={<ViewLeads />} />
          </Route>
          <Route path="/campaign">
            <Route index element={<Campaign />} />
            <Route path="viewcampaign" element={<ViewCampaign />} />
          </Route>
          <Route path="/association" element={<Association />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/setting">
            <Route index element={<Settings />} />
            <Route path="addrole" element={<AddRoleAccess />} />
            <Route path="editrole" element={<EditRoleAccess />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </BrowserRouter>
);

export default App;
