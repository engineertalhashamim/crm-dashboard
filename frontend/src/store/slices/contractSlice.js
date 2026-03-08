import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contracts: [],
  loading: false,
  error: null,
  success: false
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setContract: (state, action) => {
      state.contracts = action.payload;
      state.error = null;
      state.loading = false;
    },
    setAddContract: (state, action) => {
      state.contracts.push(action.payload);
      state.contracts = action.payload;
      state.error = null;
      state.loading = false;
      state.success = true;
    },
    setDeleteContract: (state, action) => {
      state.contracts = state.contracts.filter((contract) => contract.id !== action.payload);
      state.loading = false;
      state.error = null;
      state.success = true;
    }
  }
});

export const { setLoading, setError, setContract, setAddContract, setDeleteContract } = contractSlice.actions;
export default contractSlice.reducer;
