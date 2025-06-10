import React, { useEffect, useState } from "react";
import "./chartBoxTDS.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

const ChartBoxTDS = () => {
  const [latest, setLatest] = useState(0);
  const [mean, setMean] = useState(0);
  const [chartData, setChartData] = useState<{ TDS: number }[]>([]);
  const unit = "ppm";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/sensor-summary?type=TDS", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLatest(data.latest);
        setMean(data.average7days);
        const formatted = data.history.map((val: number) => ({
          TDS: val,
        }));
        setChartData(formatted);
      })
      .catch((err) => {
        console.error("Error fetching TDS data:", err);
      });
  }, []);

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <img src="element.svg" alt="TDS icon" />
          <span>TDS</span>
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
                dataKey="TDS"
                stroke="violet"
                strokeWidth={3}
                dot={{ stroke: "violet", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span className="mean" style={{ color: "violet" }}>
            {mean}
          </span>
          <span className="duration">average in 7 days</span>
        </div>
      </div>
    </div>
  );
};

export default ChartBoxTDS;
