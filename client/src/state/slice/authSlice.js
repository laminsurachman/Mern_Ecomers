import { createSlice } from "@reduxjs/toolkit";
import { loginUser, loadUser } from "../api/authApi";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: false,
    user: null,
    isLoading: false,
  },
  reducer: {
    authReset: (state) => {
      state.isAuth = false;
      state.authLoading = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false;
        state.isAuth = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { authReset } = authSlice.actions;
export default authSlice.reducer;
