import React, { useEffect, useState } from "react";
import "./chartBoxWaterLevel.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

const API_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3000/ws";
const MAX_POINTS = 30;

const ChartBoxWaterLevel = () => {
  const [latest, setLatest] = useState<number | "N/A">("N/A");
  const [mean, setMean] = useState(0);
  const [chartData, setChartData] = useState<{ water_level: number }[]>([]);
  const unit = "cm";

  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    // Initial fetch
    fetch(`${API_URL}/sensor-summary?type=waterLevel`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const latestVal = d?.latest;
        setLatest(typeof latestVal === "number" ? latestVal : "N/A");

        const avg = d?.average7days;
        setMean(typeof avg === "number" ? Number(avg.toFixed(2)) : 0);

        setChartData(
          (d?.history ?? []).map((entry: { value: number | null; timestamp: string }) => ({
            water_level: entry.value, // keep null
            created_at: entry.timestamp
          }))
        );
      })
      .catch((err) => console.error("Error fetching water level:", err));

    // WebSocket
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);

        if (msg?.type === "garden_log_inserted") {
          // Update 7d average if provided (even for partials)
          const avg = msg?.averages7d?.water_level;
          if (typeof avg === "number") {
            setMean(Number(avg.toFixed(2)));
          }

          // Latest may be null/undefined on partial snapshot
          const wl = msg?.data?.water_level;
          if (typeof wl !== "number" || Number.isNaN(wl)) {
            // Partial: show N/A and don't push to chart
            setLatest("N/A");
            return;
          }

          // Full (or partial but water_level present): update
          setLatest(wl);
          setChartData((prev) => {
            const next = [...prev, { water_level: wl }];
            return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
          });
        }
      } catch {
        /* ignore bad frames */
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <img src="water.svg" alt="Water level icon" />
          <span>Water Level</span>
        </div>
        <h1>
          {typeof latest === "number" ? latest : "N/A"}{" "}
          {typeof latest === "number" && unit && (
            <small className="unit">{unit}</small>
          )}
        </h1>
        <p>Latest</p>
      </div>

      <div className="chartInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={chartData}>
              <Tooltip
                wrapperStyle={{
                  backgroundColor: "rgba(0,0,0,0.75)",
                  borderRadius: 8,
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
                connectNulls={false} // <-- gap on null
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
