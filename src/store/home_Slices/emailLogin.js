import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  isVerified: false,
};

const loginSlice = createSlice({
  name: 'emailLogin',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setVerified(state, action) {
      state.isVerified = action.payload;
    },
    clearLoginData(state) {
        state.email = '';
        state.isVerified = '';
      },
  },
});

export const {setEmail,clearLoginData,setVerified} = loginSlice.actions;
export default loginSlice.reducer;
