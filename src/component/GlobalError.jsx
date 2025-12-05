import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors } from '../redux/slices/taskSlice';

const GlobalError = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.task);

  if (!error) return null;

  const handleClose = () => {
    dispatch(clearErrors());
  };

  return (
    <div className="global-error">
      <div className="error-content">
        <strong>Error:</strong> {error}
        <button onClick={handleClose} className="error-close-btn">
          ×
        </button>
      </div>
    </div>
  );
};

export default GlobalError;