import React, { useEffect, useState } from "react";
import "./chartBoxTemperature.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

const ChartBoxTemperature = () => {
  const [latest, setLatest] = useState(0);
  const [mean, setMean] = useState(0);
  const [chartData, setChartData] = useState<{ temperature: number }[]>([]);
  const unit = "°C";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/sensor-summary?type=temperature", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
      .then((res) => res.json())
      .then((data) => {
        setLatest(data.latest);
        setMean(data.average7days);
        const formatted = data.history.map((val: number) => ({
          temperature: val,
        }));
        setChartData(formatted);
      })
      .catch((err) => {
        console.error("Error fetching temperature data:", err);
      });
  }, []);

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <img src="temperature.svg" alt="Temperature icon" />
          <span>Temperature</span>
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
                dataKey="temperature"
                stroke="orange"
                strokeWidth={3}
                dot={{ stroke: "orange", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span className="mean" style={{ color: "orange" }}>
            {mean}
          </span>
          <span className="duration">average in 7 days</span>
        </div>
      </div>
    </div>
  );
};

export default ChartBoxTemperature;
