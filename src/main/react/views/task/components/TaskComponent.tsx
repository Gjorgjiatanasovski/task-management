import { Button, Dialog, DialogContent} from "@mui/material";
import { TaskForm } from "./TaskForm";
import { useTasks } from "../hooks/useTasks";
import TaskDataGrid from "./TaskDataGrid";
import TaskSnackbar from "./TaskSnackbar";


export default function  TaskComponent() {

    const { tasks, setTasks, addTask, patchTask, toggleTask, deleteTask } = useTasks();
    const { form, dialogIsOpen, setForm, handleOpenNewForm, handleOpenForm, handleCloseForm} = useTasks();
    const { snackbarState, handleOpenSnackbar, handleCloseSnackbar} = useTasks();
    const { loading, rowCount, paginationModel, handlePaginationChange} = useTasks();
    
    return (
        <>
        <Button onClick={handleOpenNewForm}>Add Task</Button>
        <Dialog open={dialogIsOpen} 
                onClose={handleCloseForm}
                closeAfterTransition={false}>
            <DialogContent>
                <TaskForm form={form} setForm={setForm} onError={handleOpenSnackbar} 
                onAdd={addTask} onPatch={patchTask} onClose={handleCloseForm}
                paginationModel={paginationModel} setPaginationModel={handlePaginationChange} setTasks={setTasks}/>
            </DialogContent>
        </Dialog>

        <TaskDataGrid tasks={tasks} setTasks={setTasks} 
            onToggle={toggleTask} handleOpenform={handleOpenForm} onDelete={deleteTask} onError={handleOpenSnackbar} 
            rowCount={rowCount} paginationModel={paginationModel} setPaginationModel={handlePaginationChange}
            loading={loading}/>

        <TaskSnackbar state={snackbarState} onClose={handleCloseSnackbar}/>
        </>
    );
}