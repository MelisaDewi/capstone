import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import "./dataTable.scss";

type Props<T> = {
  columns: GridColDef[];   
  rows: T[];           
  slug: string;           
  getRowId: (row: T) => string | number;  
  // onDelete: (id: number) => void; 
};

const DataTable = <T,>({ columns, rows, slug, getRowId}: Props<T>) => {
  // If delete operation is needed
  const handleDelete = (id: number) => {
    // if (onDelete) {
    //   onDelete(id);  // Trigger the delete function passed as a prop
    // }
  };

  // const actionColumn: GridColDef = {
  //   field: "actionable",
  //   headerName: "Actionable", // Renamed header to "Actionable"
  //   width: 200,
  //   renderCell: (params) => {
  //     const rowId = params.row.id;
  //     return (
  //       <div className="action">
  //         <a href={`/${slug}/${rowId}`}>
  //           <img src="/view.svg" alt="View" />
  //         </a>
  //         <div className="delete" onClick={() => handleDelete(rowId)}>
  //           <img src="/delete.svg" alt="Delete" />
  //         </div>
  //       </div>
  //     );
  //   },
  // };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={rows}
        columns={[...columns]}  
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
        getRowId={getRowId} 
      />
    </div>
  );
};

export default DataTable;
