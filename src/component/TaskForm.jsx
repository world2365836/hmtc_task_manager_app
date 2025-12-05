import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, setFormErrors, clearErrors } from '../redux/slices/taskSlice';

const TaskForm = () => {
  const dispatch = useDispatch();
  const { loading, formErrors } = useSelector((state) => state.task);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      dispatch(clearErrors());
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must not exceed 255 characters';
    }
    
    // Validate description
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }
    
    // Validate due date
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const now = new Date();
      // Set both dates to start of day for comparison
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const selectedDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      
      if (selectedDate <= today) {
        newErrors.dueDate = 'Due date must be in the future';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      dispatch(setFormErrors(newErrors));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Format the data for backend
    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      // Create a proper ISO string for the entire day (end of day)
      due_date_time: new Date(formData.dueDate + 'T23:59:59').toISOString()
    };
    console.log(taskData);
    
    // Dispatch the createTask action
    dispatch(createTask(taskData))
      .then(() => {
        // Reset form on success
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          dueDate: ''
        });
      })
      .catch((error) => {
        console.error('Task creation failed:', error);
      });
  };

  // Get minimum date (tomorrow) for due date
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  return (
    <div className="task-form">
      <h2>Create New Task</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={formErrors.title ? 'error' : ''}
            placeholder="Enter task title"
            disabled={loading}
          />
          {formErrors.title && (
            <span className="error-text">{formErrors.title}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={formErrors.description ? 'error' : ''}
            rows="3"
            placeholder="Enter task description (optional)"
            disabled={loading}
          />
          {formErrors.description && (
            <span className="error-text">{formErrors.description}</span>
          )}
          <div className="char-count">
            {formData.description.length}/1000 characters
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="status">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {formErrors.status && (
            <span className="error-text">{formErrors.status}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">
            Due Date *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={formErrors.dueDate ? 'error' : ''}
            min={getMinDate()}
            disabled={loading}
          />
          {formErrors.dueDate && (
            <span className="error-text">{formErrors.dueDate}</span>
          )}
          <div className="date-hint">
            Select a future date
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? (
            <span className="loading-indicator">
              <span className="spinner"></span>
              Creating Task...
            </span>
          ) : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;