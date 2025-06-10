import { useState, useEffect } from "react";
import "./notifications.scss";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";

interface NotificationLog {
  id: number;
  user_id: number;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  { field: "user_id", headerName: "User ID", width: 100, type: "number" },
  { field: "title", headerName: "Title", width: 200, type: "string" },
  { field: "message", headerName: "Message", width: 300, type: "string" },
  {
    field: "created_at",
    headerName: "Created At",
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
    width: 200,
    renderCell: (params) => {
      const id = params.row.id;
      return (
        <div className="action">
          <a href={`/notification/${id}`} className="view-button">
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


const Notifications = () => {
  const [logs, setLogs] = useState<NotificationLog[]>([]); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/get-notifications", {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  })
      .then((res) => res.json())
      .then((data) => {
        const logsWithDeleteHandler = data.map((log: NotificationLog) => ({
          ...log,
          deleteHandler: handleDelete,
        }));
        setLogs(logsWithDeleteHandler);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
      });
  }, []);

  const handleDelete = (id: number) => {
    const token = localStorage.getItem("token");

  fetch(`http://localhost:3000/delete-notification/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Notification deleted!");
        setLogs((prev) => prev.filter((log) => log.id !== id));
      } else {
        alert("Failed to delete notification.");
      }
    })
    .catch((err) => console.error("Error deleting notification:", err));
};

  return (
    <div className="notifications">
      <div className="info">
        <h1>Notifications</h1>
      </div>
      {/* Use the reusable DataTable component */}
      <DataTable
        slug="notification"
        columns={columns}
        rows={logs} 
        getRowId={(row) => row.id} 
      />
    </div>
  );
};

export default Notifications;
