import React, { useEffect, useState } from 'react';
import './TaskForm.css';

function TaskForm({ onSubmit, initialData, mode = 'create', onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'PENDING',
        dueDate: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'PENDING',
                dueDate: initialData.dueDate ? toDateTimeLocal(initialData.dueDate) : ''
            });
            setErrors({});
        }
    }, [initialData, mode]);

    const toDateTimeLocal = (isoString) => {
        // datetime-local needs YYYY-MM-DDTHH:mm format
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Task title is required';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }

        return newErrors;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const taskToSubmit = {
            ...formData,
            dueDate: new Date(formData.dueDate).toISOString()
        };

        await onSubmit(taskToSubmit);

        setFormData({
            title: '',
            description: '',
            status: 'PENDING',
            dueDate: ''
        });
        setErrors({});
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>{mode === 'edit' ? 'Edit task' : 'Task details'}</h2>
                <p>{mode === 'edit' ? 'Update and save task changes' : 'Create and track caseworker tasks'}</p>
            </div>

            <form onSubmit={handleFormSubmit} className="task-form">
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="title">
                            Task title <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={errors.title ? 'input-error' : ''}
                            placeholder="Enter task title"
                        />
                        {errors.title && <span className="error-text">{errors.title}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="description">Description (optional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Provide additional details about the task"
                        />
                    </div>
                </div>

                <div className="form-row split">
                    <div className="form-field">
                        <label htmlFor="status">
                            Status <span className="required">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="dueDate">
                            Due date <span className="required">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            className={errors.dueDate ? 'input-error' : ''}
                        />
                        {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit">
                        {mode === 'edit' ? 'Save changes' : 'Add task'}
                    </button>
                    {mode === 'edit' && (
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default TaskForm;
