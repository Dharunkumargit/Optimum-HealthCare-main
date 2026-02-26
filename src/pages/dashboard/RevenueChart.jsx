import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", revenue: 20 },
  { name: "Feb", revenue: 25 },
  { name: "Mar", revenue: 50 },
  { name: "Apr", revenue: 40 },
  { name: "May", revenue: 20 },
  { name: "June", revenue: 65 },
  { name: "July", revenue: 50 },
  { name: "Aug", revenue: 40 },
  { name: "Sep", revenue: 20 },
  { name: "Oct", revenue: 25 },
  { name: "Nov", revenue: 50 },
  { name: "dec", revenue: 40 },
];

const RevenueChart = () => {
  return (
    <div className=" p-4 border dark:text-white">
      <h2 className="text-lg mb-2 font-semibold">Monthly Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
          />
          <YAxis  axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar
            dataKey="revenue"
            fill="#5E52CE"
            barSize={20}
            radius={[4, 4, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RevenueChart;
