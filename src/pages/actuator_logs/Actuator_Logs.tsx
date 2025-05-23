import { useState } from "react";
import "./actuator_logs.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
import { actuatorLogs } from "../../data";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  { field: "user_id", headerName: "User ID", width: 100, type: "number" },
  { field: "actuator_action", headerName: "Actuator Action", width: 200, type: "string" },
  { field: "status", headerName: "Status", width: 150, type: "string" },
  {
    field: "created_at",
    headerName: "Executed At",
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



const Actuator_Logs = () => {

  return (
    <div className="actuator_logs">
      <div className="info">
        <h1>Actuator Logs</h1>
      </div>
      <DataTable slug="Actuator_Log" columns={columns} rows={actuatorLogs} />
      {/* TEST THE API */}

      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="products" columns={columns} rows={data} />
      )} */}
    </div>
  );
};

export default Actuator_Logs;
