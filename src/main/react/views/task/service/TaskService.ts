import axios from 'axios';
import { isErrorResponse, isTask, type SpringPageableRequest, type SpringPageableResponse, type Task, type TaskRequest } from '../taskTypes';

const API_URL = 'http://localhost:8080/api/v1/tasks';

export const taskService = {
  async getAll(): Promise<Task[]> {
    const res = await fetch(API_URL);
    return res.json();
  },
  async getById(id: string): Promise<Task>{
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
  },
  async getPage(pageReq: SpringPageableRequest): Promise<SpringPageableResponse<Task>> {
    const res = await axios.get(`${API_URL}/paged`, {
      params: pageReq,
    });
    return res.data;
  },
  async create(task: Omit<TaskRequest, 'id'>,onError: (message: string) => void): Promise<Task | null> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const res = response.clone();
    if(res.ok && isTask(res.json())) {
      return res.json();
    } else if(isErrorResponse(res.json())){
      onError("error")
    }
    return null;
  },
  async update(id: number, updates: Partial<TaskRequest>,onError: (message: string) => void): Promise<Task | null  > {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).then(response => {
      return response.clone();
    })

    if(res.ok && isTask(res.json())) {
      return res.json();
    } else if(isErrorResponse(res.json())){
      onError("error")
    }
    return null;
    
  },
  async delete(id: number): Promise<void> {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  }
};