import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  userEmail: string;
  userName: string;
}

const initialState: initialState = {
  userEmail: localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "",
  userName: localStorage.getItem("userName") || sessionStorage.getItem("userName") || "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeUser: (state: initialState, action) => {
      state.userEmail = action.payload.email;
      state.userName = action.payload.name;
    },
    removeUser: (state: initialState) => {
      state.userEmail = "";
      state.userName = "";
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userName");
    },
  },
});

export default userSlice.reducer;
export const { removeUser, changeUser } = userSlice.actions;
