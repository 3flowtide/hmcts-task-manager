import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import * as taskService from './services/taskService';

function App() {
    const [tasks, setTasks] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [sortBy, setSortBy] = useState('DUE_ASC');
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);

    const sortTasks = (items) => {
        // Client-side sorting - backend only sorts by due date
        const sorted = [...items];
        switch (sortBy) {
            case 'DUE_DESC':
                return sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
            case 'TITLE_ASC':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'STATUS_ASC':
                return sorted.sort((a, b) => a.status.localeCompare(b.status));
            case 'DUE_ASC':
            default:
                return sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }
    };

    const loadTasks = async () => {
        try {
            setIsLoading(true);
            const data = await taskService.fetchAllTasks(selectedStatus);
            setTasks(sortTasks(data));  // Apply client-side sort after fetch
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Unable to load tasks. Please try again.');
            console.error('Error loading tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStatus, sortBy]);

    const handleCreateOrUpdateTask = async (taskData) => {
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask.id, taskData);
                setEditingTask(null);
            } else {
                await taskService.addTask(taskData);
            }
            await loadTasks();
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Failed to save task. Please check your input.');
            console.error('Error saving task:', error);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await taskService.changeTaskStatus(taskId, newStatus);
            await loadTasks();
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Could not update task status.');
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to remove this task?')) {
            return;
        }

        try {
            await taskService.removeTask(taskId);
            if (selectedTask?.id === taskId) {
                setSelectedTask(null);
            }
            if (editingTask?.id === taskId) {
                setEditingTask(null);
            }
            await loadTasks();
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Failed to delete task.');
            console.error('Error deleting task:', error);
        }
    };

    const handleViewTask = async (taskId) => {
        try {
            const task = await taskService.fetchTaskById(taskId);
            setSelectedTask(task);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Could not load selected task.');
            console.error('Error loading task details:', error);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setSelectedTask(task);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <div className="header-content">
                    <div className="logo-section">
                        <div className="crown-logo"></div>
                        <h1>HM Courts & Tribunals Service</h1>
                    </div>
                    <p className="header-subtitle">Task Management System</p>
                </div>
            </header>

            <main className="app-main">
                <div className="content-wrapper">
                    {errorMessage && (
                        <div className="notification error-notification">
                            <span className="notification-icon">⚠</span>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {isLoading && (
                        <div className="loading-overlay">
                            <div className="spinner"></div>
                            <p>Loading tasks...</p>
                        </div>
                    )}

                    <TaskForm
                        onSubmit={handleCreateOrUpdateTask}
                        initialData={editingTask}
                        mode={editingTask ? 'edit' : 'create'}
                        onCancel={handleCancelEdit}
                    />

                    <div className="task-controls">
                        <div className="control-group">
                            <label htmlFor="statusFilter">Filter by status</label>
                            <select
                                id="statusFilter"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="ALL">All</option>
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label htmlFor="sortBy">Sort tasks</label>
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="DUE_ASC">Due date (earliest first)</option>
                                <option value="DUE_DESC">Due date (latest first)</option>
                                <option value="TITLE_ASC">Title (A-Z)</option>
                                <option value="STATUS_ASC">Status</option>
                            </select>
                        </div>
                    </div>

                    <TaskTable
                        tasks={tasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onView={handleViewTask}
                        selectedTaskId={selectedTask ? selectedTask.id : null}
                    />

                    {selectedTask && (
                        <div className="task-details">
                            <h3>Task details</h3>
                            <p><strong>Title:</strong> {selectedTask.title}</p>
                            <p><strong>Status:</strong> {selectedTask.status}</p>
                            <p><strong>Due:</strong> {formatDateTime(selectedTask.dueDate)}</p>
                            <p><strong>Description:</strong></p>
                            <div className="task-description-full">
                                {selectedTask.description || 'No description'}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <p>© Crown copyright</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
