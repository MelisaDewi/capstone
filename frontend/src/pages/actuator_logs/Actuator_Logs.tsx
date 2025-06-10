import { useState, useEffect } from "react";
import "./actuator_logs.scss";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";

interface ActuatorLog {
  id: number;
  user_id: number;
  action: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleteHandler?: (id: number) => void;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  { field: "user_id", headerName: "User ID", width: 100, type: "number" },
  { field: "action", headerName: "Actuator Action", width: 250, type: "string" },
  { field: "status", headerName: "Status", width: 150, type: "string" },
  {
    field: "created_at",
    headerName: "Executed At",
    width: 200,
    type: "dateTime",
    valueGetter: (params) => new Date(params.value),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    renderCell: (params) => {
      const id = params.row.id;
      return (
        <div className="action">
          {/* View Button */}
          <a href={`/actuator_log/${id}`} className="view-button">
            <img src="/view.svg" alt="View" />
          </a>

          {/* Delete Button */}
          <div className="delete" onClick={() => params.row.deleteHandler?.(id)}>
            <img src="/delete.svg" alt="Delete" />
          </div>
        </div>
      );
    },
  },
];

const Actuator_Logs = () => {
  const [logs, setLogs] = useState<ActuatorLog[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/get-logs", {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  })
      .then((res) => res.json())
      .then((data) => {
        const logsWithDeleteHandler = data.map((log: ActuatorLog) => ({
          ...log,
          deleteHandler: handleDelete,
        }));
        setLogs(logsWithDeleteHandler);
      })
      .catch((err) => {
        console.error("Error fetching actuator logs:", err);
      });
  }, []);

  const handleDelete = (id: number) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/delete-log/${id}`, {
      method: "DELETE",
      headers: {
      Authorization: `Bearer ${token}`,
    },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Log deleted successfully!");
          setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
        } else {
          alert("Failed to delete log.");
        }
      })
      .catch((err) => console.error("Error deleting log:", err));
  };

  return (
    <div className="actuator_logs">
      <div className="info">
        <h1>Actuator Logs</h1>
      </div>
      <DataTable<ActuatorLog>
        slug="actuator_logs"
        columns={columns}
        rows={logs}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default Actuator_Logs;
