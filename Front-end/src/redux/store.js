import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./Slices/authSlice";
import movieSlice from "./Slices/movieSlice";
import filterSlice from "./Slices/filterSlice";
import categorySlice from "./Slices/categorySlice";
import theaterSlice from "./Slices/movieTheaterSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    movies: movieSlice,
    filters: filterSlice,
    categories: categorySlice,
    movieTheaters: theaterSlice,
  },
});
export default store;
