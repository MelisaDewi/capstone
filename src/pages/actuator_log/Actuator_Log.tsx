import Single from "../../components/single/Single";
import "./actuator_log.scss";

const actuatorLog = {
  id: 1,
  user_id: 101,
  actuator_action: "Pump Turned ON",
  status: "Success",
  created_at: "2025-05-23T10:15:30Z",
  updated_at: "2025-05-23T10:15:30Z",
};

const Actuator_Log = () => {
  // Prepare info array for Single component
  const info = [
    { label: "User ID", value: actuatorLog.user_id },
    { label: "Action", value: actuatorLog.actuator_action },
    { label: "Status", value: actuatorLog.status },
    { label: "Created At", value: new Date(actuatorLog.created_at).toLocaleString() },
    { label: "Updated At", value: new Date(actuatorLog.updated_at).toLocaleString() },
  ];

  return (
    <div className="actuator_log">
      <Single
        id={actuatorLog.id}
        title="Actuator Log Detail"
        info={info}
      />
    </div>
  );
};

export default Actuator_Log;
