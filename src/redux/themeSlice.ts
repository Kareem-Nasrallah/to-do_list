import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  mode: string;
}

// Initial state, checking for localStorage or system preference
const initialState: initialState = {
  mode:
    localStorage.getItem("theme") ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
};

// Create slice for theme
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Toggle theme between light and dark
    toggleTheme: (state: initialState) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      state.mode = newMode;
      localStorage.setItem("theme", newMode);
    },
  },
});

export default themeSlice.reducer;
export const { toggleTheme } = themeSlice.actions;
