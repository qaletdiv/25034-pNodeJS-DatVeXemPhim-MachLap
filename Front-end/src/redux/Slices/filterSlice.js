import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: null,
  category: null,
  format: null,
  theater: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value ?? null;
      });
    },

    resetFilter: () => initialState,
  },
});

export const { setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
