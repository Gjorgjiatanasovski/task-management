import { useState, useEffect } from 'react';
import { isErrorResponse, isTask, type SnackbarState, type SpringPageableRequest, type Task, type TaskRequest } from '../taskTypes';
import { taskService } from '../service/TaskService';
import type { GridPaginationModel } from '@mui/x-data-grid';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "",
    vertical: 'bottom',
    horizontal: 'right',
  })

  const [rowCount, setRowCount] = useState(0);

  const defaultFormState: Task = {
    id: '',
    title: "",
    description: "",
    isCompleted: false,
    dueDate: null
  }

  const defaultPageableRequest : SpringPageableRequest = {
    page: 0,
    size: 5,
    sort: 'id,ASC'
  }

  const defaultPageableState : GridPaginationModel = {
    page: defaultPageableRequest.page,
    pageSize: defaultPageableRequest.size,
  }

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(defaultPageableState);
  
  
  const [form, setForm] = useState(defaultFormState);
  



  useEffect(() => {
    console.log("initial load call");
    taskService.getAll().then(data => {
      setTasks(data);
      setLoading(false);
    });
    
  }, []);

  

  const addTask = async (data: Omit<Task, 'id'>) => {
    const addTaskrequest : TaskRequest = {...data,
              id:null,
              dueDate:data.dueDate!= null? data.dueDate.format("YYYY-MM-DD"):null}
    const taskResponse = await taskService.create(addTaskrequest);
    if(isTask(taskResponse)) {
      setTasks(prev => [...prev, taskResponse]);
    } else if (isErrorResponse(taskResponse)){
      if(taskResponse.errors!==null){
        handleOpenSnackbar(taskResponse.message)
      } else {
        handleOpenSnackbar(taskResponse.message);
      }
    }

  };

  const patchTask = async (id: string, data: Task) => {
    const patchTaskRequest : TaskRequest = {...data,
              id:null,
              dueDate:data.dueDate ? data.dueDate.format("YYYY-MM-DD") : null }
    const updated = await taskService.update(id, patchTaskRequest);
    setTasks(tasks.map(t => t.id === id ? updated : t));
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updated = await taskService.update(id, { isCompleted: !task.isCompleted });
    setTasks(tasks.map(t => t.id === id ? updated : t));
  };

  const deleteTask = async (id: string) => {
    await taskService.delete(id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleOpenNewForm = () =>{
    console.log("open dialog");
    setForm(defaultFormState);
    setDialogIsOpen(true);
  }

  const handleOpenForm = (task : Task | null) =>{
    console.log("open dialog");
    if(task!==null){
      setForm(task);
    } else {
      setForm(defaultFormState);
    }
    setDialogIsOpen(true);
  }

  const handleCloseForm = () => {
    console.log("close dialog");
    setForm(defaultFormState);
    setDialogIsOpen(false);
  }

  const handleOpenSnackbar = (message: string) => {
    setSnackbarState({ ...snackbarState, open: true, message: message });
  }

  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  }

  

  return { tasks, loading, form, dialogIsOpen,
    handleOpenNewForm, handleOpenForm, handleCloseForm, setForm,
    addTask, patchTask, toggleTask, deleteTask,
    snackbarState, handleOpenSnackbar, handleCloseSnackbar };
};