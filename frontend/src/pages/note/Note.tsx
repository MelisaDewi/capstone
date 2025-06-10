import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  
import { GridColDef } from "@mui/x-data-grid";
import Single from "../../components/single/Single";
import Edit from "../../components/edit/Edit";
import "./note.scss";

interface MaintenanceLog {
  id: number;
  user_id: number;
  activity: string;
  created_at: string;
  updated_at: string;
}

const columns: GridColDef[] = [
  { field: "activity", headerName: "Activity", type: "string", width: 300 },
];

const Note = () => {
  const { id } = useParams<{ id: string }>(); 
  console.log(id);

  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<MaintenanceLog | null>(null); 

  useEffect(() => {
    if (!id) {
      alert("Note ID is missing from the URL.");
      return;
    }
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/get-note/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setNote(data); 
        } else {
          console.log("Note not found");
          console.log(data.note);
          setNote(data.note);
        }
      })
      .catch((err) => {
        console.error("Error fetching note:", err);
        alert("Failed to load note");
      });
  }, [id]);  

 
  if (!note) return <div>Loading...</div>;

  
  const info = [
    { label: "User ID", value: note.user_id },
    { label: "Activity", value: note.activity },
    { label: "Created At", value: new Date(note.created_at).toLocaleString() },
    { label: "Updated At", value: new Date(note.updated_at).toLocaleString() },
  ];

  
  const handleSubmit = (data: { [key: string]: string }) => {
    setNote((prev) => {
      if (prev) {
        return {
          ...prev,
          activity: data.activity,
          updated_at: new Date().toISOString(),
        };
      }
      return prev;
    });
  };

  return (
    <div className="note">
      <Single
        id={note.id}
        title="Note Detail"
        info={info}
        isNote
        onEditClick={() => setOpen(true)}
      />
      {open && (
        <Edit
          slug="note"
          columns={columns}
          setOpen={setOpen}
          defaultValues={{ id: note.id.toString(), activity: note.activity }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Note;
