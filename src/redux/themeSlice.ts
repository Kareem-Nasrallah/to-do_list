import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  mode: string;
}

const initialState: initialState = {
  mode:
    localStorage.getItem("theme") ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state: initialState) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      state.mode = newMode;
      localStorage.setItem("theme", newMode);
    },
  },
});

export default themeSlice.reducer;
export const { toggleTheme } = themeSlice.actions;
