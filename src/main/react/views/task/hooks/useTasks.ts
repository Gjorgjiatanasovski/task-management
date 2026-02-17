import { useState, useEffect, useRef } from 'react';
import { isTask, type SnackbarState, type SpringPageableRequest, type Task, type TaskRequest } from '../taskTypes';
import { taskService } from '../service/TaskService';
import type { GridPaginationModel } from '@mui/x-data-grid';

export const useTasks = () => {
  const initialized = useRef(false)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "",
    vertical: 'bottom',
    horizontal: 'right',
  })



  const defaultFormState: Task = {
    id: null,
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

  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(defaultPageableState);
  
  
  const [form, setForm] = useState(defaultFormState);
  
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      console.log("initial load call");
      taskService.getPage(defaultPageableRequest).then(data => {
        setTasks(data.content);
        setPaginationModel({
          page: 0,
          pageSize: 5
        })
        setRowCount(data.totalElements);
        setLoading(false);
        console.log("end load call");
      });
    }
  }, []);

  

  const addTask = async (data: Omit<Task, 'id'>, onError: (message: string) => void) => {
    const addTaskrequest : TaskRequest = {...data,
              id:null,
              dueDate:data.dueDate!= null? data.dueDate.format("YYYY-MM-DD"):null}
    const taskResponse = await taskService.create(addTaskrequest,onError);
    if(taskResponse!==null && isTask(taskResponse)) {
      setTasks(prev => [...prev, taskResponse]);
    } 
  };

  const patchTask = async (id: number, data: Task, onError: (message: string) => void) => {
    const patchTaskRequest : TaskRequest = {...data,
              id:null,
              dueDate:data.dueDate ? data.dueDate.format("YYYY-MM-DD") : null }
    await taskService.update(id, patchTaskRequest,onError);
  };

  const toggleTask = async (id: number, onError: (message: string) => void) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await taskService.update(id, { isCompleted: !task.isCompleted },onError);
  };

  const deleteTask = async (id: number) => {
    await taskService.delete(id);
  };

  //------ form --------

  const handleOpenNewForm = () =>{
    setForm(defaultFormState);
    setDialogIsOpen(true);
  }

  const handleOpenForm = (task : Task | null) =>{
    if(task!==null){
      setForm(task);
    } else {
      setForm(defaultFormState);
    }
    setDialogIsOpen(true);
  }

  const handleCloseForm = () => {
    setForm(defaultFormState);
    setDialogIsOpen(false);
  }

  //------ end form --------

  //------ snackbar --------

  const handleOpenSnackbar = (message: string) => {
    setSnackbarState({ ...snackbarState, open: true, message: message });
  }

  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false,message:"" });
  }

  //------ end snackbar --------

  //------ data grid --------

 

  const handlePaginationChange = async (paginationData: GridPaginationModel,updateTasks: (tasks: Task []) => void) => {
    const pageableReq: SpringPageableRequest= {...defaultPageableRequest,page: paginationData.page}
    console.log("handler load call - page:" + paginationData.page);
    setLoading(true);
    await taskService.getPage(pageableReq);
    await taskService.getPage(pageableReq).then(data => {
      updateTasks(data.content);
      setPaginationModel({
          page: paginationData.page,
          pageSize: 5
        })
      setRowCount(data.totalElements);
      setLoading(false);
      console.log("end handler load call");
    });
  }

  //------ end data grid --------
  

  return { tasks, loading, form, dialogIsOpen, setTasks,
    handleOpenNewForm, handleOpenForm, handleCloseForm, setForm,
    addTask, patchTask, toggleTask, deleteTask,
    snackbarState, handleOpenSnackbar, handleCloseSnackbar,
    rowCount, paginationModel, handlePaginationChange };
};