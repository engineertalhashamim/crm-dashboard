import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usersArr: [],
  loggedInUser: {},
  loading: false,
  error: null,
  success: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAllUser: (state, action) => {
      state.usersArr = action.payload;
      state.error = null;
      state.loading = false;
    },
    setAddUser: (state, action) => {
      state.usersArr.push(action.payload);
      state.error = null;
      state.loading = false;
      state.success = true;
    },
    setDeleteUser: (state, action) => {
      state.usersArr = state.usersArr.filter((status) => status.id !== action.payload);
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    setUpdateUser: (state, action) => {
      const index = state.usersArr.findIndex((status) => status.id === action.payload.id);
      if (index !== -1) {
        state.usersArr[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    clearSessson: (state, action) => {
      state.loggedInUser = null;
    },
    clearError: (state) => {
      state.error = {};
    }
  }
});

export const { setLoading, setError, setAllUser, setAddUser, setDeleteUser, setUpdateUser, setLoggedInUser, clearError } = userSlice.actions;
export default userSlice.reducer;
