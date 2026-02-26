import React from "react";

const campaigns = [
  { id: "#25235", channel: "Instagram", budget: "₹4687", cpl: "₹4687", leads: 51 },
  { id: "#25236", channel: "Instagram", budget: "₹4687", cpl: "₹4687", leads: 51 },
  { id: "#25237", channel: "Instagram", budget: "₹4687", cpl: "₹4687", leads: 51 },
  { id: "#25238", channel: "Instagram", budget: "₹4687", cpl: "₹4687", leads: 51 },
  { id: "#25239", channel: "Instagram", budget: "₹4687", cpl: "₹4687", leads: 51 },
  { id: "#25240", channel: "Instagram", budget: "₹4687", cpl: "₹4687", leads: 51 },
];

const RecentCampaigns = () => {
  return (
    <div className="dark:bg-layout-dark bg-layout-light p-4 rounded-xl dark:text-white">
      <h2 className="text-lg font-semibold mb-3">Recent Campaign</h2>
      <ul className="space-y-1 text-sm">
        {campaigns.map((camp) => (
          <li
            key={camp.id}
            className="flex justify-between items-center border-b dark:border-layout-dark border-layout-light dark:bg-overall_bg-dark bg-overall_bg-light rounded-lg px-2 py-2"
          >
            <div>
              <p>{camp.id}</p>
              <p className="dark:text-gray-100 font-extralight"><span className="font-semibold">Channel:</span> {camp.channel}</p>
              <p className="dark:text-gray-100 "><span className="font-semibold">Leads Count:</span> {camp.leads}</p>
            </div>
            <div>
            <p className="dark:text-gray-100 font-extralight"><span className="font-semibold">Budget:</span> {camp.budget}</p>
            <p className="dark:text-gray-100 font-extralight"><span className="font-semibold">CPL:</span> {camp.cpl}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RecentCampaigns;
