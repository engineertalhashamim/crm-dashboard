import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  statusArr: [],
  loading: false,
  error: null,
  success: false
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setStatus: (state, action) => {
      state.statusArr = action.payload;
      state.error = null;
      state.loading = false;
    },
    setAddStatus: (state, action) => {
      state.statusArr.push(action.payload);
      state.error = null;
      state.loading = false;
      state.success = true;
    },
    setDeleteStatus: (state, action) => {
      state.statusArr = state.statusArr.filter((status) => status.id !== action.payload);
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    setUpdateStatus: (state, action) => {
      const index = state.statusArr.findIndex((status) => status.id === action.payload.id);
      if (index !== -1) {
        state.statusArr[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
      state.success = true;
    }
  }
});

export const { setLoading, setError, setStatus, setAddStatus, setDeleteStatus, setUpdateStatus } = statusSlice.actions;
export default statusSlice.reducer;
