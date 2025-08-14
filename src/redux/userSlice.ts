import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  userEmail: string;
  userName: string;
  rememberMe: boolean;
}

// Initial state, checking for data in localStorage or sessionStorage
const initialState: initialState = {
  userEmail:
    sessionStorage.getItem("userEmail") ??
    localStorage.getItem("userEmail") ??
    "",
  userName:
    sessionStorage.getItem("userName") ??
    localStorage.getItem("userName") ??
    "",
  rememberMe: false,
};

// Create slice for user
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to change user information
    changeUser: (state: initialState, { payload }) => {
      state.userEmail = payload.email;
      state.userName = payload.name;
      if (payload.rememberMe) {
        localStorage.setItem("userEmail", payload.email);
        localStorage.setItem("userName", payload.name);
      } else {
        sessionStorage.setItem("userEmail", payload.email);
        sessionStorage.setItem("userName", payload.name);
      }
    },

    // Action to remove user information from state and storage
    removeUser: (state: initialState) => {
      state.userEmail = "";
      state.userName = "";
      // Removing user data from local and session storage
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userName");
    },
  },
});

export default userSlice.reducer;
export const { removeUser, changeUser } = userSlice.actions;
