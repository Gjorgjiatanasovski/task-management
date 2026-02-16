import axios from 'axios';
import type { ErrorResponse, SpringPageableRequest, SpringPageableResponse, Task, TaskRequest } from '../taskTypes';

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
  async create(task: Omit<TaskRequest, 'id'>): Promise<Task | ErrorResponse> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return res.json();
  },
  async update(id: string, updates: Partial<TaskRequest>): Promise<Task> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },
  async delete(id: string): Promise<void> {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  }
};