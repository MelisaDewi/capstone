import React, { useEffect, useState } from "react";
import "./chartBoxPH.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

const ChartBoxPH = () => {
  const [latest, setLatest] = useState(0);
  const [mean, setMean] = useState(0);
  const [chartData, setChartData] = useState<{ pH: number }[]>([]);
  const unit = ""; 

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/sensor-summary?type=pH", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
      .then((res) => res.json())
      .then((data) => {
        setLatest(data.latest);
        setMean(data.average7days);
        const formatted = data.history.map((val: number) => ({
          pH: val,
        }));
        setChartData(formatted);
      })
      .catch((err) => {
        console.error("Error fetching pH data:", err);
      });
  }, []);

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <img src="ph.png" alt="pH icon" />
          <span>pH</span>
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
                }}
                formatter={(value: any) => [`${value} ${unit}`, ""]}
                labelFormatter={() => ""}
              />
              <Line
                type="monotone"
                dataKey="pH"
                stroke="#00e676"
                strokeWidth={3}
                dot={{ stroke: "#00e676", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span className="mean" style={{ color: "#00e676" }}>
            {mean}
          </span>
          <span className="duration">average in 7 days</span>
        </div>
      </div>
    </div>
  );
};

export default ChartBoxPH;
