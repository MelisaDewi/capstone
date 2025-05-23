import { useState } from "react";
import "./notifications.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
import { notificationLogs } from "../../data";

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
    field: "title",
    headerName: "Title",
    width: 200,
    type: "string",
  },
  {
    field: "message",
    headerName: "Message",
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

const Notifications = () => {

  return (
    <div className="notifications">
      <div className="info">
        <h1>Notifications</h1>
      </div>
      <DataTable slug="notification" columns={columns} rows={notificationLogs} />
      {/* TEST THE API */}

      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="products" columns={columns} rows={data} />
      )} */}
    </div>
  );
};

export default Notifications;
