import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import Single from "../../components/single/Single";
import Edit from "../../components/edit/Edit";
import "./note.scss";

const noteData = {
  id: 1,
  user_id: 101,
  activity: "Checked water level and refilled the tank",
  created_at: new Date("2025-05-21T08:30:00Z"),
  updated_at: new Date("2025-05-21T08:45:00Z"),
};

const columns: GridColDef[] = [
  { field: "activity", headerName: "Activity", type: "string", width: 300 },
];

const Note = () => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(noteData);

  const info = [
    { label: "User ID", value: note.user_id },
    { label: "Activity", value: note.activity },
    { label: "Created At", value: note.created_at.toLocaleString() },
    { label: "Updated At", value: note.updated_at.toLocaleString() },
  ];

  const handleSubmit = (data: { [key: string]: string }) => {
    setNote((prev) => ({
      ...prev,
      activity: data.activity,
      updated_at: new Date(),
    }));
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
          defaultValues={{ activity: note.activity }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Note;
