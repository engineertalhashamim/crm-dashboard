import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leadsArr: [],
  loading: false,
  error: {},
  success: false
};

const userSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAllLead: (state, action) => {
      state.leadsArr = action.payload;
      state.error = null;
      state.loading = false;
    },
    setAddLead: (state, action) => {
      state.leadsArr.push(action.payload);
      state.error = null;
      state.loading = false;
      state.success = true;
    },
    setDeleteLead: (state, action) => {
      state.leadsArr = state.leadsArr.filter((lead) => lead.id !== action.payload);
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    setUpdateLead: (state, action) => {
      const index = state.leadsArr.findIndex((lead) => lead.id === action.payload.id);
      if (index !== -1) {
        state.leadsArr[index] = action.payload;
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

export const { setLoading, setError, setAllLead, setAddLead, setDeleteLead, setUpdateLead, clearError } = userSlice.actions;
export default userSlice.reducer;
