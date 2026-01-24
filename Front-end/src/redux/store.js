import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./Slices/authSlice";
import movieSlice from "./Slices/movieSlice";
import filterSlice from "./Slices/filterSlice";
import categorySlice from "./Slices/categorySlice";
import theaterSlice from "./Slices/movieTheaterSlice";
import seatSlice from "./Slices/seatSlice";
import orderSlice from "./Slices/orderSlice";
import showtimeSlice from "./Slices/showtimeSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    movies: movieSlice,
    filters: filterSlice,
    categories: categorySlice,
    movieTheaters: theaterSlice,
    seats: seatSlice,
    orders: orderSlice,
    showtime: showtimeSlice,
  },
});
export default store;
