
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contacts: [],
  singleContact: {},
  loading: false,
  error: null,
  success: false
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setContact: (state, action) => {
      state.contacts = action.payload
      state.loading = false
      state.error = null
    },
    setAddContact: (state, action) => {
      state.contacts.push(action.payload)
      state.loading = false
      state.error = null
      state.success = true
    },
    setDeleteContact: (state, action) => {
      state.contacts = state.contacts.filter((contact) => contact.id !== action.payload)
      state.loading = false
      state.error = null
      state.success = true
    },
    setUpdateContact: (state, action) => {
      const index = state.contacts.findIndex((contact) => contact.id === action.payload.id)
      if (index !== -1) {
        state.contacts[index] = action.payload
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
  setContact,
  setAddContact,
  setDeleteContact,
  setUpdateContact,
} = contactSlice.actions
export default contactSlice.reducer