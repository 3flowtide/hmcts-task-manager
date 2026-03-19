import React from 'react';
import './TaskTable.css';

function TaskTable({ tasks, onStatusChange, onDelete, onEdit, onView, selectedTaskId }) {

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const getStatusBadge = (status) => {
        const classMap = {
            'PENDING': 'badge-pending',
            'IN_PROGRESS': 'badge-progress',
            'COMPLETED': 'badge-completed'
        };
        return classMap[status] || '';
    };

    const truncateDesc = (text) => {
        if (!text) return null;
        // 90 chars keeps table readable without excessive wrapping
        return text.length > 90 ? `${text.slice(0, 90)}...` : text;
    };

    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <p>No tasks to display</p>
                <p className="empty-hint">Create your first task using the form above</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h2>Task list</h2>
                <span className="task-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
            </div>

            <table className="task-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Due date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id} className={selectedTaskId === task.id ? 'row-selected' : ''}>
                            <td className="title-cell">
                                <button className="link-button" onClick={() => onView(task.id)}>
                                    {task.title}
                                </button>
                            </td>
                            <td className="description-cell">
                                {task.description ? truncateDesc(task.description) : <span className="no-data">No description</span>}
                            </td>
                            <td>
                                <select
                                    value={task.status}
                                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                                    className={`status-select ${getStatusBadge(task.status)}`}
                                    aria-label={`Update status for ${task.title}`}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </td>
                            <td className="date-cell">{formatDateTime(task.dueDate)}</td>
                            <td className="actions-cell">
                                <div className="actions-group">
                                    <button
                                        onClick={() => onView(task.id)}
                                        className="btn-view"
                                        aria-label="View task details"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => onEdit(task)}
                                        className="btn-edit"
                                        aria-label="Edit task"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(task.id)}
                                        className="btn-delete"
                                        aria-label="Delete task"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TaskTable;
