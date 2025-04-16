import { combineSlices, configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
import userSlice from "./userSlice";

// Combine the slices into a root reducer
const rootReducer = combineSlices({ theme: themeSlice, user: userSlice });

// Configure and create the Redux store
const store = configureStore({
  reducer: rootReducer,
});

export default store;

// Define RootState type based on the store's state
export type RootState = ReturnType<typeof store.getState>;