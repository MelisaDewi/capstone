import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { GridColDef } from "@mui/x-data-grid";
import Single from "../../components/single/Single"; 
import Edit from "../../components/edit/Edit";     
import "./actuator_log.scss";

interface ActuatorLog {
  id: number;
  user_id: number;
  action: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const columns: GridColDef[] = [
  { field: "action", headerName: "Actuator Action", type: "string", width: 300 },
  { field: "status", headerName: "Status", type: "string", width: 150 },
];

const Actuator_Log = () => {
  const { care_id } = useParams<{ care_id: string }>();  
  console.log(care_id);

  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<ActuatorLog | null>(null);  

  useEffect(() => {
    if (!care_id) {
      alert("Actuator Log ID is missing from the URL.");
      return;
    }
const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/actuator_logs/${care_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.actuator_log) {
          setLog(data.actuator_log);  
        } else {
          console.log("Actuator log not found");
          console.log(data);
          console.log(care_id);
        }
      })
      .catch((err) => {
        console.error("Error fetching actuator log:", err);
        alert("Failed to load actuator log");
      });
  }, [care_id]);  

  if (!log) return <div>Loading...</div>;

  const info = [
    { label: "ID", value: log.id },
    { label: "User ID", value: log.user_id },
    { label: "Actuator Action", value: log.action },
    { label: "Status", value: log.status },
    { label: "Created At", value: new Date(log.created_at).toLocaleString() },
    { label: "Updated At", value: new Date(log.updated_at).toLocaleString() },
  ];

  const handleSubmit = (data: { [key: string]: string }) => {
    setLog((prev) => {
      if (prev) {
        return {
          ...prev,
          action: data.action || prev.action,
          status: data.status || prev.status,
          updated_at: new Date().toISOString(),
        };
      }
      return prev;
    });
  };

  return (
    <div className="actuator_log">
      <Single
        id={log.id}
        title="Actuator Log Detail"
        info={info}
        isNote={false}  
        onEditClick={() => setOpen(true)}
      />
    </div>
  );
};

export default Actuator_Log;
