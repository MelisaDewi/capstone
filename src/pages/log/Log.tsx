import Single from "../../components/single/Single";
import "./log.scss";

const gardenLog = {
  id: 1,
  user_id: 101,
  temperature: 24.5,
  water_level: 75,
  pH: 6.2,
  TDS: 850,
  created_at: new Date("2025-05-21T09:15:00Z"),
  updated_at: new Date("2025-05-21T09:45:00Z"),
};

const Log = () => {
  const info = [
    { label: "User ID", value: gardenLog.user_id },
    { label: "Temperature", value: `${gardenLog.temperature} °C` },
    { label: "Water Level", value: `${gardenLog.water_level} %` },
    { label: "pH", value: gardenLog.pH },
    { label: "TDS", value: `${gardenLog.TDS} ppm` },
    { label: "Created At", value: gardenLog.created_at.toLocaleString() },
    { label: "Updated At", value: gardenLog.updated_at.toLocaleString() },
  ];

  return (
    <div className="log">
      <Single
        id={gardenLog.id}
        title="Garden Log Detail"
        info={info}
      />
    </div>
  );
};

export default Log;
