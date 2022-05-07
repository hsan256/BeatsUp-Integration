import { createSlice } from '@reduxjs/toolkit';

export const uploadErrorSlice = createSlice({
  name: 'uploadError',
  initialState: {
    value: null,
  },
  reducers: {
    setUploadError: (state, action) => {
      return {
        ...state,
        value: action.payload
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUploadError } = uploadErrorSlice.actions;

export default uploadErrorSlice.reducer;