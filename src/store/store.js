// store.js
import { configureStore } from "@reduxjs/toolkit";
import emailLoginSlice from "./home_Slices/emailLogin";
import themeSlice from "./dashboard_Slices/themeSlice";

const store = configureStore({
  reducer: {
    // -------------home Page Slices--------------------
    theme: themeSlice,
    emailLogin: emailLoginSlice,
  },
});

export default store;