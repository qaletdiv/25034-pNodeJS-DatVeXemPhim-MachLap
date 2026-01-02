import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    title: "",
    category: "",
    format: "",
    theater: "",
  },
  reducers: {
    setFilter: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        if (value === "" || value === null) {
          delete state[key];
        } else {
          state[key] = value;
        }
      });
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
