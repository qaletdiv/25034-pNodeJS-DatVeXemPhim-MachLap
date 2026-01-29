import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../api/axiosClient";

export const fetchMovie = createAsyncThunk(
  "movies/fetchMovie",
  async (params = {}) => {
    const response = await axiosClient.get("/api/movie", { params });
    return response.data;
  },
);

export const fetchMovieAdmin = createAsyncThunk(
  "movies/fetchMovieAdmin",
  async () => {
    const response = await axiosClient.get("/api/movie/get-movies-admin");
    return response.data;
  },
);

export const fetchMovieCarousel = createAsyncThunk(
  "movies/fetchMovieCarousel",
  async () => {
    const response = await axiosClient.get("/api/movie/carousel");
    return response.data;
  },
);
// export const addProduct = createAsyncThunk(
//   "products/addProduct",
//   async ({ name, img, listImg, categoriesId, description, price, brand }) => {
//     const reponse = await axiosClient.post("/api/products", {
//       name,
//       img,
//       listImg,
//       categoriesId,
//       description,
//       price,
//       brand,
//     });
//     return reponse.data;
//   }
// );

// export const deleteProduct = createAsyncThunk(
//   "products/deleteProduct",
//   async (id) => {
//     await axiosClient.delete(`/api/products/${id}`);
//     return id;
//   }
// );

// export const updateProduct = createAsyncThunk(
//   "products/updateProduct",
//   async ({
//     id,
//     name,
//     img,
//     listImg,
//     categoriesId,
//     description,
//     price,
//     brand,
//   }) => {
//     const updateProduct = {
//       name,
//       img,
//       listImg,
//       categoriesId,
//       description,
//       price,
//       brand,
//     };
//     const response = await axiosClient.patch(
//       `/api/products/${id}`,
//       updateProduct
//     );

//     return response.data;
//   }
// );

export const fetchMovieById = createAsyncThunk(
  "movies/fetchMovieById",
  async (id) => {
    const response = await axiosClient.get(`/api/movie/${id}`);
    return response.data;
  },
);

const initialState = {
  list: [],
  movies: [],
  carousel: [],
  loading: false,
  success: false,
  error: null,
  status: "now",
  currentMovie: null,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.newProduct = null;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMovie.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMovieAdmin.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMovieAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //carousel
      .addCase(fetchMovieCarousel.fulfilled, (state, action) => {
        state.loading = false;
        state.carousel = action.payload;
      })
      // .addCase(addProduct.pending, (state, action) => {
      //   state.loading = true;
      //   state.error = null;
      //   state.success = false;
      // })
      // .addCase(addProduct.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.success = true;
      //   state.products.push(action.payload);
      // })
      // .addCase(addProduct.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // })
      // .addCase(deleteProduct.pending, (state, action) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(deleteProduct.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.products = state.products.filter(
      //     (item) => item.id !== action.payload
      //   );
      // })
      // .addCase(deleteProduct.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // })
      // .addCase(updateProduct.pending, (state, action) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(updateProduct.fulfilled, (state, action) => {
      //   state.loading = false;
      //   let index = state.products.findIndex(
      //     (item) => item.id === action.payload.id
      //   );
      //   if (index !== -1) {
      //     state.products[index] = action.payload;
      //   }
      // })
      // .addCase(updateProduct.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // })
      .addCase(fetchMovieById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { resetStatus, setStatus } = movieSlice.actions;
export default movieSlice.reducer;
