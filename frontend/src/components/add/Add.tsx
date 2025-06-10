import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { useState } from "react";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
};

const Add = (props: Props) => {

  const [activity, setActivity] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const activity = (document.querySelector('textarea[name="activity"]') as HTMLTextAreaElement).value;

    const newNote = {
      activity,
    };

    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/add-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Note added:", data);
        if (props.onSuccess) props.onSuccess();
        props.setOpen(false);  
      })
      .catch((err) => {
        console.error("Error adding note:", err);
      });
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter(
              (item) =>
                item.field !== "id" &&
                item.field !== "img" &&
                item.field !== "user_id" &&
                item.field !== "created_at" &&
                item.field !== "updated_at" &&
                item.field !== "timestamp" &&
                item.field !== "log_id" &&
                item.field !== "actionable" &&
                item.field !== "log_id"
            )
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                {column.field === "activity" ? (
                  <textarea name="activity" placeholder={column.field} required />
                ) : (
                  <input type={column.type} placeholder={column.field} />
                )}
              </div>
            ))}
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
