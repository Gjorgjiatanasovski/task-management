import { DataGrid,type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Stack, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { TaskDataGridProps } from '../taskTypes';
import dayjs from 'dayjs';

// 1. Define the Task Interface

export default function TaskDataGrid({tasks,onToggle,handleOpenform,onDelete}:TaskDataGridProps) {

  // 2. Define Action Handlers
  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const handleToggle = (id: string) => {
    onToggle(id);
  }

  const handleEdit = (id: string) => {
    console.log("Edit task:", id);
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    
    handleOpenform({...task,dueDate:dayjs(task.dueDate)});
  };



  // 3. Define Columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'dueDate', headerName: 'Due Date', width: 150 },
    { 
      field: 'isCompleted', 
      headerName: 'Completed', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox checked={params.value} onClick={() => handleToggle(params.row.id)} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid 
        rows={tasks}
        columns={columns} 
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        disableRowSelectionOnClick 
      />
    </div>
  );
}
