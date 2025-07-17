import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    data: null,
    token: null,
  },
  reducers: {
    login(state, action) {
      state.data = action.payload.data;
      state.token = action.payload.token;
    },
    logout(state) {
      state.data = null;
      state.token = null;
    },
  },
});

export const { login, logout } = adminSlice.actions;
export default adminSlice.reducer;
