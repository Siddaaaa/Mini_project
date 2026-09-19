import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API helper functions
export const fetchPets = async () => {
  const res = await api.get('/pets');
  return res.data;
};

export const createPet = async (petData) => {
  const res = await api.post('/pets', petData);
  return res.data;
};

export const deletePet = async (id) => {
  const res = await api.delete(`/pets/${id}`);
  return res.data;
};

export const fetchTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.pet && filters.pet !== 'all') params.append('pet', filters.pet);

  const res = await api.get(`/tasks?${params.toString()}`);
  return res.data;
};

export const fetchUpcomingTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.pet && filters.pet !== 'all') params.append('pet', filters.pet);

  const res = await api.get(`/tasks/upcoming?${params.toString()}`);
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await api.post('/tasks', taskData);
  return res.data;
};

export const toggleTaskStatus = async (id) => {
  const res = await api.patch(`/tasks/${id}/toggle`);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};

export default api;
