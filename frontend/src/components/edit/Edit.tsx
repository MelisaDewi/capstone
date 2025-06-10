import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import "./edit.scss";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues?: { [key: string]: string };
  onSubmit?: (data: { [key: string]: string }) => void;
};

const Edit = ({ slug, columns, setOpen, defaultValues = {}, onSubmit }: Props) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>(
    () =>
      Object.fromEntries(
        columns.map((col) => [col.field, defaultValues[col.field] || ""])
      )
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = defaultValues?.id;
    if (!id) {
      alert("Cannot update: missing note ID.");
      return;
    }
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/update-note/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activity: formData.activity }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Note updated successfully!");
          if (onSubmit) onSubmit(formData);
        } else {
          alert("Failed to update note.");
        }
      })
      .catch((err) => {
        console.error("Error updating note:", err);
        alert("Error occurred while updating note.");
      });

    setOpen(false);
  };

  return (
    <div className="edit">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>
          X
        </span>
        <h1>Edit {slug}</h1>
        <form onSubmit={handleSubmit}>
          {columns
            .filter(
              (col) =>
                !["id", "img", "user_id", "created_at", "updated_at"].includes(
                  col.field
                )
            )
            .map((col) => (
              <div className="item" key={col.field}>
                <label>{col.headerName}</label>
                {col.field === "activity" ? (
                  <textarea
                    name={col.field}
                    value={formData[col.field]}
                    onChange={handleChange}
                    placeholder={col.field}
                  />
                ) : (
                  <input
                    type={col.type}
                    name={col.field}
                    value={formData[col.field]}
                    onChange={handleChange}
                    placeholder={col.field}
                  />
                )}
              </div>
            ))}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
