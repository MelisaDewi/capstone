import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Single from "../../components/single/Single";
import "./log.scss";

interface GardenLog {
  id: number;
  user_id: number;
  temperature: number;
  water_level: number;
  pH: number;
  TDS: number;
  created_at: string;
  updated_at: string;
}

const Log = () => {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<GardenLog | null>(null);

  useEffect(() => {
    if (!id) {
      alert("Log ID is missing from the URL.");
      return;
    }
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/garden_logs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLog(data.garden_log);
        } else {
          alert("Log not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching garden log:", err);
        alert("Failed to load garden log");
      });
  }, [id]);

  if (!log) return <div>Loading...</div>;

  const info = [
    { label: "User ID", value: log.user_id },
    { label: "Temperature", value: `${log.temperature} °C` },
    { label: "Water Level", value: `${log.water_level} %` },
    { label: "pH", value: log.pH },
    { label: "TDS", value: `${log.TDS} ppm` },
    { label: "Created At", value: new Date(log.created_at).toLocaleString() },
    { label: "Updated At", value: new Date(log.updated_at).toLocaleString() },
  ];

  return (
    <div className="log">
      <Single
        id={log.id}
        title="Garden Log Detail"
        info={info}
      />
    </div>
  );
};

export default Log;
