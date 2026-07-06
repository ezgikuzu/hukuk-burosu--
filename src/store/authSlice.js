import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";

const initialAuthState = {
  currentUser: loadState("currentUser", {
    id: "admin_1",
    name: "Genel Yönetici",
    email: "admin@edbm.com",
    role: "admin",
    phone: "+90 212 999 8877",
  }),
  isAuthenticated: loadState("isAuthenticated", true),
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      saveState("currentUser", state.currentUser);
      saveState("isAuthenticated", true);
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      saveState("currentUser", null);
      saveState("isAuthenticated", false);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
