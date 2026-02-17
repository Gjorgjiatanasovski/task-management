import { Box, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import type { TaskFormProps } from '../taskTypes';
import { useState } from 'react';

export const TaskForm = ({form,setForm,onAdd,onPatch,onClose,onError,
  paginationModel, setPaginationModel, setTasks
}:TaskFormProps) => {

  const defaultTitleErrorState = {
    hasError: false,
    message: ""
  }

  const [titleError,setTitleError] = useState(defaultTitleErrorState)

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title) {
      setTitleError({
        hasError: true,
        message: "Title can't be empty!"
      })
      return;
    } else if (form.title.length>99) {
      setTitleError({
        hasError: true,
        message: "Title must be less than 100 characters!"
      })
      return;
    }
    if (form.id === null || form.id === undefined) {
      onAdd(form,onError);
      setPaginationModel(paginationModel,setTasks);
    } else {
      onPatch(form.id, form, onError);
      setPaginationModel(paginationModel,setTasks);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if(titleError.hasError) {
        setTitleError(defaultTitleErrorState);
      }
      setForm({...form,[e.target.name]:e.target.value})
  }

  const handleDateChange = (newValue: Dayjs | null) => {
    setForm({...form, dueDate: newValue});
  };

  const handleCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form,[e.target.name]:e.target.checked})
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
    <Typography variant="h6" gutterBottom>
      {form.id ? 'Edit Task' : 'Create New Task'}
    </Typography>
    <Box
      component='form'
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField name='title' variant='outlined' label='Title' type='text'
          error={titleError.hasError}
          value={form.title}
          onChange={handleChange}
          helperText={titleError.message}/>
        <TextField name='description' variant='outlined' label='Description' type='text'
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange}/>
        <DatePicker
          label="Select a Date"
          value={form.dueDate}
          onChange={handleDateChange}
        />
        <FormControlLabel control={<Checkbox 
          name='isCompleted'
          checked={form.isCompleted}
          onChange={handleCheckedChange} />} label="Completed" />
          <Button type="submit" variant="contained" fullWidth size="large" name='submit' >
            {form.id ? 'Update Task' : 'Add Task'}
          </Button>
          <Button onClick={onClose} >Close</Button>
      </Stack>
    </Box>
    </Paper>
  );
};