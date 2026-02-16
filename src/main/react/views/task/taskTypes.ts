import type { SnackbarOrigin } from "@mui/material";
import type { Dayjs } from "dayjs";

export interface Task {
  id: string ;
  title: string;
  description: string | null;
  isCompleted: boolean;
  dueDate: Dayjs | null ; 
}

export function isTask(obj: any): obj is Task {
  return (
        obj &&
        typeof obj.id === 'number' &&
        typeof obj.title === 'string'
    );
}

export interface TaskRequest {
  id: string | null ;
  title: string;
  description: string | null;
  isCompleted: boolean;
  dueDate: string | null ; 
}

export interface ErrorResponse{
  errors: Array<ValidationError> | null;
  message: string;
  status: number;
  timestamp: number;
}

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return (
        obj &&
        typeof obj.status === 'number' &&
        typeof obj.message === 'string'
    );
}

export interface ValidationError {
  fieldName: string | null;
  violation: string | null;
}

export interface SpringPageableRequest {
  page: number;
  size: number;
  sort: string;
}

export interface SpringSortable {
  field: string;
  direction: SpringSortDirection;
}

const SpringSortDirection = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type SpringSortDirection = typeof SpringSortDirection[keyof typeof SpringSortDirection]; 
 

export interface SpringPageableResponse<T> {
  content: Array<T>;
  pageable: SpringPageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
  sort: SpringSorted;
}

export interface SpringSorted {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface SpringPageable {
  pageNumber: number;
  pageSize: number;
  sort: SpringSorted;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface TaskProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export interface TaskDataGridProps {
  tasks: Task [];
  onToggle: (id: string) => void;
  handleOpenform: (task: Task) => void;
  onDelete: (id: string) => void;
  //rowCount: number;
  //: GridPaginationModel;
  //setPaginationModel: (paginationData: GridPaginationModel) => void;
}

export interface TaskFormProps {
  form: Task;
  setForm: (task: Task) => void;
  onAdd: (task: any) => void;
  onClose: () => void;
  onPatch: (id: string, data: Task) => void;
}

export interface TaskSnackbarProps {
  state: SnackbarState;
  onClose: () => void;
}

export interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  message: string;
}