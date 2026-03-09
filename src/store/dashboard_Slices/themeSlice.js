// store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: "light",
  reducers: {
    setLightTheme: () => "light",
    setDarkTheme: () => "dark",
    toggleTheme: (state) => (state === "light" ? "dark" : "light"),
  },
});

export const { setLightTheme, setDarkTheme, toggleTheme } =
  themeSlice.actions;

export default themeSlice.reducer;
