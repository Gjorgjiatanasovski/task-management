import { Button, Dialog, DialogContent} from "@mui/material";
import { TaskForm } from "./TaskForm";
import { useTasks } from "../hooks/useTasks";
import TaskDataGrid from "./TaskDataGrid";
import TaskSnackbar from "./TaskSnackbar";


export default function  TaskComponent() {

    const { tasks, addTask, patchTask, toggleTask, deleteTask } = useTasks();
    const { form, dialogIsOpen, setForm, handleOpenNewForm, handleOpenForm, handleCloseForm} = useTasks();
    const { snackbarState, handleCloseSnackbar} = useTasks();
    
    return (
        <>
        <Button onClick={handleOpenNewForm}>Add Task</Button>
        <Dialog open={dialogIsOpen} 
                onClose={handleCloseForm}
                closeAfterTransition={false}>
            <DialogContent>
                <TaskForm form={form} setForm={setForm} 
                onAdd={addTask} onPatch={patchTask} onClose={handleCloseForm}/>
            </DialogContent>
        </Dialog>

        <TaskDataGrid tasks={tasks} onToggle={toggleTask} handleOpenform={handleOpenForm} onDelete={deleteTask}/>

        <TaskSnackbar state={snackbarState} onClose={handleCloseSnackbar}/>
        </>
    );
}