import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sourceArr : [],
    error : null,
    loading : false,
    success: false
}

const sourceSlice = createSlice({
    name: 'source',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
            // state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setAllSource: (state, action) => {
           state.sourceArr = action.payload;
           state.loading = false;
           state.error = null;
        },
        setAddSource: (state, action) => {
           state.sourceArr.push(action.payload)
           state.loading = false;
           state.error = null;
           state.success = true;
        },
        setDeleteSource: (state, action) => {
           state.sourceArr = state.sourceArr.filter((source) => source.id !== action.payload);
           state.loading = false;
           state.error = null;
           state.success = true
        },
        setUpdateSource: (state, action) => {
           const index = state.sourceArr.findIndex((source) => source.id === action.payload.id);
           if(index !== -1) {
            state.sourceArr[index] = action.payload;
           }    
           state.loading = false;
           state.error = null;
           state.success = true
        }
    }
});

export const { setLoading, setError, setAllSource, setAddSource, setDeleteSource, setUpdateSource } = sourceSlice.actions;
export default sourceSlice.reducer;