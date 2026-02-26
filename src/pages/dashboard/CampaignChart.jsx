import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Instagram", value: 40 },
  { name: "Facebook", value: 20 },
  { name: "Twitter", value: 50 },
];

const COLORS = ["#F4A79D", "#FDC153", "#F68D2B"];

const CampaignChart = () => {
  return (
    <>
      <div className=" flex items-end dark:text-white text-black">
        <p className="text-lg font-semibold place-self-start dark:text-white mt-8">Campaign</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 mr-10">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default CampaignChart;
