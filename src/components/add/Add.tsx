import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Add = (props: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.setOpen(false);
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
                item.field !== "updated_at"
            )
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                {column.field === "activity" ? (
                  <textarea placeholder={column.field} />
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
