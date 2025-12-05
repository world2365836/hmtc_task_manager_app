import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTaskState } from '../redux/slices/taskSlice';

const TaskConfirmation = () => {
  const dispatch = useDispatch();
  const { currentTask, success } = useSelector((state) => state.task);

  // Don't render if no successful task or not in success state
  if (!success || !currentTask) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB');
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const handleClearConfirmation = () => {
    dispatch(clearTaskState());
  };

  return (
    <div className="task-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h3>Task Created Successfully!</h3>
      </div>
      
      <p className="confirmation-message">
        Your task has been created and saved to the system.
      </p>
      
      <div className="task-details-card">
        <h4>Task Details</h4>
        
        <div className="detail-item">
          <span className="detail-label">Task ID:</span>
          <span className="detail-value id-value">{currentTask.id}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Title:</span>
          <span className="detail-value">{currentTask.title}</span>
        </div>
        
        {currentTask.description && (
          <div className="detail-item">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{currentTask.description}</span>
          </div>
        )}
        
        <div className="detail-item">
          <span className="detail-label">Status:</span>
          <span className={getStatusClass(currentTask.status)}>
            {getStatusLabel(currentTask.status)}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Due Date:</span>
          <span className="detail-value">{formatDate(currentTask. due_date_time)}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Created:</span>
          <span className="detail-value">{formatDate(currentTask.created_at)}</span>
        </div>
      </div>
      
      <div className="confirmation-footer">
        <p className="note">
          <strong>Note:</strong> This task is now stored in the system. 
          You can create another task using the form.
        </p>
      </div>
      
      <button 
        onClick={handleClearConfirmation}
        className="clear-btn"
      >
        Clear Confirmation
      </button>
    </div>
  );
};

export default TaskConfirmation;