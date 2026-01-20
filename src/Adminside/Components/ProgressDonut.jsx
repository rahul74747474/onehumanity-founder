import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const ProgressDonut = ({ percent }) => {
  const data = [
    { name: "Completed", value: percent },
    { name: "Remaining", value: 100 - percent },
  ];

  const COLORS = ["#6D5BD0", "#E6E8FF"];

  return (
    <div style={{ width: 200, height: 200, position: "relative" }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            innerRadius={70}
            outerRadius={90}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          {percent}%
        </h2>
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
          Complete
        </p>
      </div>
    </div>
  );
};

export default ProgressDonut;
