import { useState, useEffect } from "react";
import "./garden_Logs.scss";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";

interface GardenLog {
  id: number;
  user_id: number;
  temperature: number;
  water_level: number;
  pH: number;
  TDS: number;
  created_at: string;
  updated_at: string;
  deleteHandler?: (id: number) => void;
}

const Garden_Logs = () => {
  const [logs, setLogs] = useState<GardenLog[]>([]);

  const fetchLogs = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/get-garden-logs", {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  })
      .then((res) => res.json())
      .then((data) => {
        const logsWithDeleteHandler = data.map((log: GardenLog) => ({
          ...log,
          deleteHandler: handleDelete,
        }));
        setLogs(logsWithDeleteHandler);
      })
      .catch((err) => {
        console.error("Error fetching garden logs:", err);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = (id: number) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/delete-garden-log/${id}`, {
      method: "DELETE",
      headers: {
      Authorization: `Bearer ${token}`,
    },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Log deleted successfully!");
          fetchLogs(); 
        } else {
          alert("Failed to delete log.");
        }
      })
      .catch((err) => console.error("Error deleting log:", err));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Log ID", width: 90, type: "number" },
    { field: "user_id", headerName: "User ID", width: 100, type: "number" },
    { field: "temperature", headerName: "Temperature (°C)", width: 150, type: "number" },
    { field: "water_level", headerName: "Water Level", width: 150, type: "number" },
    { field: "pH", headerName: "pH", width: 100, type: "number" },
    { field: "TDS", headerName: "TDS (ppm)", width: 150, type: "number" },
    {
      field: "created_at",
      headerName: "Logged At",
      width: 200,
      type: "dateTime",
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 200,
      type: "dateTime",
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "actionable",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <div className="action">
            <a href={`/log/${id}`} className="view-button">
              <img src="/view.svg" alt="View" />
            </a>
            <div className="delete" onClick={() => params.row.deleteHandler?.(id)}>
              <img src="/delete.svg" alt="Delete" />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="logs">
      <div className="info">
        <h1>Garden Logs</h1>
      </div>
      <DataTable<GardenLog>
        slug="log"
        columns={columns}
        rows={logs}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default Garden_Logs;
