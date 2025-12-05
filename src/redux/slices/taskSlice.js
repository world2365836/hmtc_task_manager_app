import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/api';

// Initial state
const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  success: false,
  error: null,
  formErrors: {},
};

// Async thunk for creating a task
export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskService.createTask(taskData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Clear current task and success state
    clearTaskState: (state) => {
      state.currentTask = null;
      state.success = false;
      state.error = null;
      state.formErrors = {};
    },
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.formErrors = {};
    },
    // Set form errors manually
    setFormErrors: (state, action) => {
      state.formErrors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.formErrors = {};
      })
      // Handle fulfilled state
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTask = action.payload.task;
        state.tasks.push(action.payload.task);
        state.error = null;
        state.formErrors = {};
      })
      // Handle rejected state
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.error || 'Failed to create task';
        
        // Handle validation errors
        if (action.payload?.details) {
          const formErrors = {};
          action.payload.details.forEach(detail => {
            if (detail.includes('Title')) formErrors.title = detail;
            if (detail.includes('Description')) formErrors.description = detail;
            if (detail.includes('Status')) formErrors.status = detail;
            if (detail.includes('date') || detail.includes('Date')) {
              formErrors.dueDate = detail;
            }
          });
          state.formErrors = formErrors;
        }
      });
  },
});

export const { clearTaskState, clearErrors, setFormErrors } = taskSlice.actions;
export default taskSlice.reducer;