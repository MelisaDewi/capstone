import React, { useEffect, useState } from "react";
import "./chartBoxPH.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

const API_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3000/ws";
const MAX_POINTS = 30;

const ChartBoxPH = () => {
  const [latest, setLatest] = useState<number | "N/A">("N/A");
  const [mean, setMean] = useState(0);
  const [chartData, setChartData] = useState<{ pH: number }[]>([]);
  const unit = ""; // unitless

  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    // Initial fetch
    fetch(`${API_URL}/sensor-summary?type=pH`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const latestVal = d?.latest;
        setLatest(typeof latestVal === "number" ? latestVal : "N/A");

        const avg = d?.average7days;
        setMean(typeof avg === "number" ? Number(avg.toFixed(2)) : 0);

        setChartData(
  (d?.history ?? []).map(
    (entry: { value: number | null; timestamp: string }) => ({
      pH: entry.value, // keep null
      created_at: entry.timestamp
    })
  )
);

      })
      .catch((err) => console.error("Error fetching pH:", err));

    // WebSocket
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg?.type === "garden_log_inserted") {
          // Update 7d average if provided (even on partials)
          const avg = msg?.averages7d?.pH;
          if (typeof avg === "number") {
            setMean(Number(avg.toFixed(2)));
          }

          const v = msg?.data?.pH;
          if (typeof v !== "number" || Number.isNaN(v)) {
            // Partial snapshot without pH
            setLatest("N/A");
            return;
          }

          // Full (or partial that includes pH)
          setLatest(v);
          setChartData((prev) => {
            const next = [...prev, { pH: v }];
            return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
          });
        }
      } catch {
        /* ignore malformed frames */
      }
    };
    return () => ws.close();
  }, []);

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <img src="ph.png" alt="pH icon" />
          <span>pH</span>
        </div>
        <h1>
          {typeof latest === "number" ? latest : "N/A"}{" "}
          {typeof latest === "number" && unit && <small className="unit">{unit}</small>}
        </h1>
        <p>Latest</p>
      </div>

      <div className="chartInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={chartData}>
              <Tooltip
                wrapperStyle={{ backgroundColor: "rgba(0,0,0,0.75)", borderRadius: 8 }}
                formatter={(value: any) => [`${value}${unit ? ` ${unit}` : ""}`, ""]}
                labelFormatter={() => ""}
              />
              <Line
  type="monotone"
  dataKey="pH"
  stroke="#00e676"
  strokeWidth={3}
  dot={{ stroke: "#00e676", strokeWidth: 2, r: 3 }}
  activeDot={{ r: 5 }}
  connectNulls={false} // <-- important for gaps
/>

            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span className="mean" style={{ color: "#00e676" }}>{mean}</span>
          <span className="duration">average in 7 days</span>
        </div>
      </div>
    </div>
  );
};

export default ChartBoxPH;
