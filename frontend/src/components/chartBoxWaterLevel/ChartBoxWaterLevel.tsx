import React, { useEffect, useState } from "react";
import "./chartBoxWaterLevel.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

const ChartBoxWaterLevel = () => {
  const [latest, setLatest] = useState(0);
  const [mean, setMean] = useState(0);
  const [chartData, setChartData] = useState<{ water_level: number }[]>([]);
  const unit = "cm";

  useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/sensor-summary?type=waterLevel", {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ Fetched water level data:", data); 
      setLatest(data.latest);
      setMean(data.average7days);
      const formatted = data.history.map((val: number) => ({
        water_level: val,
      }));
      console.log("📈 Formatted chart data:", formatted);
      setChartData(formatted);
    })
    .catch((err) => {
      console.error("❌ Error fetching water level data:", err);
    });
}, []);

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <img src="water.svg" alt={`Water level icon`} />
          <span>Water Level</span>
        </div>
        <h1>
          {latest} {unit && <small className="unit">{unit}</small>}
        </h1>
        <p>Latest</p>
      </div>

      <div className="chartInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={chartData}>
              <Tooltip
                wrapperStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                  borderRadius: "8px",
                  border: "none",
                }}
                formatter={(value: any) => [`${value} ${unit}`, ""]}
                labelFormatter={() => ""}
              />

              <Line
                type="monotone"
                dataKey="water_level"
                stroke="cyan"
                strokeWidth={3}
                dot={{ stroke: "cyan", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="texts">
          <span className="mean" style={{ color: "cyan" }}>
            {mean}
          </span>
          <span className="duration">average in 7 days</span>
        </div>
      </div>
    </div>
  );
};

export default ChartBoxWaterLevel;
