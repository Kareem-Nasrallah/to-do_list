import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  userEmail: string;
  userName: string;
}

// Initial state, checking for data in localStorage or sessionStorage
const initialState: initialState = {
  userEmail: localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "",
  userName: localStorage.getItem("userName") || sessionStorage.getItem("userName") || "",
};

// Create slice for user
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to change user information
    changeUser: (state: initialState, action) => {
      state.userEmail = action.payload.email;
      state.userName = action.payload.name;
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
