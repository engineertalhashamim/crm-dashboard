import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itemArr: [],
  loading: false,
  error: {},
  success: false
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAllItem: (state, action) => {
      state.itemArr = action.payload;
      state.error = null;
      state.loading = false;
    },
    setAddItem: (state, action) => {
      state.itemArr.push(action.payload);
      state.error = null;
      state.loading = false;
      state.success = true;
    },
    setDeleteItem: (state, action) => {
      state.itemArr = state.itemArr.filter((item) => item.id !== action.payload);
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    setUpdateItem: (state, action) => {
      const index = state.itemArr.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.itemArr[index] = action.payload;
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

export const { setLoading, setError, setAllItem, setAddItem, setDeleteItem, setUpdateItem, clearError } = itemSlice.actions;
export default itemSlice.reducer;
