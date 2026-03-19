import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tasks';

// Fetch tasks with optional status filter
export const fetchAllTasks = async (status) => {
    const params = status && status !== 'ALL' ? { status } : {};
    const response = await axios.get(BASE_URL, { params });
    return response.data;
};

export const fetchTaskById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const addTask = async (taskData) => {
    const response = await axios.post(BASE_URL, taskData);
    return response.data;
};

export const updateTask = async (id, taskData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, taskData);
    return response.data;
};

export const changeTaskStatus = async (id, newStatus) => {
    const response = await axios.patch(`${BASE_URL}/${id}/status`, {
        status: newStatus
    });
    return response.data;
};

export const removeTask = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
};
