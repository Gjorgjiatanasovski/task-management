import { Snackbar } from "@mui/material";
import type { TaskSnackbarProps } from "../taskTypes";

export default function TaskSnackbar(props: TaskSnackbarProps) {

    const { vertical, horizontal, open ,message } = props.state;

    return (
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={props.onClose}
        message={message}
        key={vertical + horizontal}
      />
  );
}