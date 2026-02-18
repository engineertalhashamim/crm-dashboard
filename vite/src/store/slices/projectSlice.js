import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projectsArr: [],
  loading: false,
  error: {},
  success: false
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAllProject: (state, action) => {
      state.projectsArr = action.payload;
      state.error = null;
      state.loading = false;
    },
    setAddProject: (state, action) => {
      state.projectsArr.push(action.payload);
      state.error = null;
      state.loading = false;
      state.success = true;
    },
    setDeleteProject: (state, action) => {
      state.projectsArr = state.projectsArr.filter((project) => project.id !== action.payload);
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    setUpdateProject: (state, action) => {
      const index = state.projectsArr.findIndex((project) => project.id === action.payload.id);
      if (index !== -1) {
        state.projectsArr[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    clearError: (state) => {
      state.error = {};
    }
  }
});

export const { setLoading, setError, setAllProject, setAddProject, setDeleteProject, setUpdateProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;
