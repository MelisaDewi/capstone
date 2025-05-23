import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./notes.scss";
import { useState } from "react";
import Add from "../../components/add/Add";
import { noteLogs } from "../../data";
// import { useQuery } from "@tanstack/react-query";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 90,
  },
  {
    field: "user_id",
    headerName: "User ID",
    width: 100,
    type: "number",
  },
  {
    field: "activity",
    headerName: "Activity",
    width: 300,
    type: "string",
  },
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
];


const Notes = () => {
  const [open, setOpen] = useState(false);

  // TEST THE API

  // const { isLoading, data } = useQuery({
  //   queryKey: ["allusers"],
  //   queryFn: () =>
  //     fetch("http://localhost:8800/api/users").then(
  //       (res) => res.json()
  //     ),
  // });

  return (
    <div className="notes">
      <div className="info">
        <h1>Notes</h1>
        <button onClick={() => setOpen(true)}>Add New Note</button>
      </div>
      <DataTable slug="note" columns={columns} rows={noteLogs} />
      {/* TEST THE API */}

      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="users" columns={columns} rows={data} />
      )} */}
      {open && <Add slug="note" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Notes;
