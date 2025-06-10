import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./notes.scss";
import { useState, useEffect } from "react";
import Add from "../../components/add/Add";
import { noteLogs } from "../../data";

interface MaintenanceLog {
  id: number;
  user_id: number;
  activity: string;
  created_at: string;
  updated_at: string;
  deleteHandler?: (id: number) => void;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  { field: "user_id", headerName: "User ID", width: 100, type: "number" },
  { field: "activity", headerName: "Activity", width: 300, type: "string" },
  {
    field: "created_at",
    headerName: "Timestamp",
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
          <a href={`/note/${id}`} className="view-button">
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


const Notes = () => {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/get-maintenance-logs", {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched maintenance logs:", data);
        const logsWithDeleteHandler = data.map((log: MaintenanceLog) => ({
          ...log,
          deleteHandler: handleDelete,
        }));
        setLogs(logsWithDeleteHandler);  
      })
      .catch((err) => {
        console.error("Error fetching maintenance logs:", err);
      });
  };

  const handleDelete = (id: number) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/delete-note/${id}`, {
      method: "DELETE",
      headers: {
      Authorization: `Bearer ${token}`, 
    },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Note deleted successfully!");
          fetchLogs();  
        } else {
          alert("Failed to delete note.");
        }
      })
      .catch((err) => console.error("Error deleting note:", err));
  };

  return (
    <div className="notes">
      <div className="info">
        <h1>Notes</h1>
        <button onClick={() => setOpen(true)}>Add New Note</button>
      </div>

      {/* Render the DataTable with the new delete button as part of the DataTable */}
      <div className="dataTableWrapper">
        <DataTable
          slug="maintenance_log"
          columns={columns}
          rows={logs} 
          getRowId={(row) => row.id} 
        />
      </div>

      {/* Modal for adding new notes */}
      {open && <Add slug="note" columns={columns} setOpen={setOpen} onSuccess={fetchLogs}/>}
    </div>
  );
};

export default Notes;
