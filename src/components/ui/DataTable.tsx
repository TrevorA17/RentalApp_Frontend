import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  DataGrid,
  type DataGridProps,
  type GridValidRowModel,
} from "@mui/x-data-grid";

type DataTableProps<R extends GridValidRowModel> = DataGridProps<R>;

/**
 * Thin wrapper over DataGrid that applies the project's defaults: auto-height,
 * no row-selection-on-click, sensible page sizes, sortable + filterable headers,
 * and a Paper surface that matches the new theme.
 */
export function DataTable<R extends GridValidRowModel>(
  props: DataTableProps<R>,
) {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ width: "100%" }}>
        <DataGrid<R>
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            ...(props.initialState ?? {}),
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "grey.50",
              borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
              {
                outline: "none",
              },
            ...(props.sx ?? {}),
          }}
          {...props}
        />
      </Box>
    </Paper>
  );
}
