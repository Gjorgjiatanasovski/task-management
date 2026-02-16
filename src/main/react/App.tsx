import './App.css'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TaskComponent from './views/task/components/TaskComponent';

function App() {

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="card">
        <TaskComponent/>
      </div>
    </LocalizationProvider>
    </>
  )
}

export default App
