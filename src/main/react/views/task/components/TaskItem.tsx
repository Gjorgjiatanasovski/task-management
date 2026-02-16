import { Button, ButtonGroup, Checkbox, TableCell, TableRow } from "@mui/material";
import type { TaskProps } from "../taskTypes";

export const TaskItem = ({ task, onToggle, onDelete }: TaskProps) => (
  <>
  <TableRow key={task.id}>
    <TableCell component='th' scope="task">{task.id}</TableCell>
    <TableCell align="right" >{task.title}</TableCell>
    <TableCell align="right" >{task.description}</TableCell>
    <TableCell align="right" >{task.dueDate!= null? task.dueDate.toString(): ""}</TableCell>
    <TableCell align="center" >
      <Checkbox onClick={() => onToggle(task.id)} checked={task.isCompleted} ></Checkbox>
    </TableCell>
    <TableCell align="center">
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button onClick={() => onToggle(task.id)} className="text-green-600">{task.isCompleted ? 'Undo' : 'Edit'}</Button>
        <Button onClick={() => onDelete(task.id)} className="text-red-600">Delete</Button>
      </ButtonGroup>
    </TableCell>
  </TableRow>
  </>
);