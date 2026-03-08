
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clients: [],
  singleClient: {},
  loading: false,
  error: null,
  success: false
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setClient: (state, action) => {
      state.clients = action.payload
      state.loading = false
      state.error = null
    },
    setAddCLient: (state, action) => {
      state.clients.push(action.payload)
      state.loading = false
      state.error = null
      state.success = true
    },
    setDeleteClient: (state, action) => {
      state.clients = state.clients.filter((client) => client.id !== action.payload)
      state.loading = false
      state.error = null 
      state.success = true
    },
    setUpdateClient: (state, action) => {
      const index = state.clients.findIndex((client) => client.id === action.payload.id)
      if (index !== -1) {
        state.clients[index] = action.payload
      }
      state.loading = false
      state.error = null 
      state.loading = true
    }
  }
});

export const {
  setLoading,
  setError,
  setClient,
  setAddCLient,
  setDeleteClient,
  setUpdateClient,
} = clientSlice.actions
export default clientSlice.reducer