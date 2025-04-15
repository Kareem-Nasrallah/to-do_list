import { combineSlices, configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
import userSlice from "./userSlice";

const rootReducer = combineSlices({ theme: themeSlice, user: userSlice });

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;