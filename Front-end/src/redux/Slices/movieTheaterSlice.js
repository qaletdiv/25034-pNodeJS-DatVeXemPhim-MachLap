import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../api/axiosClient";

export const fetchTheater = createAsyncThunk(
  "movieTheater/fetchTheater",
  async () => {
    const response = await axiosClient.get("/api/movieTheater");
    return response.data;
  }
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

// export const fetchProductById = createAsyncThunk(
//   "products/fetchProductById",
//   async (id) => {
//     const response = await axiosClient.get(`/api/products/${id}`);
//     return response.data;
//   }
// );

const initialState = {
  movieTheaters: [],
  loading: false,
  success: false,
  error: null,
};

const movieTheaterSlice = createSlice({
  name: "movieTheaters",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchTheater.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTheater.fulfilled, (state, action) => {
        state.loading = false;
        state.movieTheaters = action.payload;
      })
      .addCase(fetchTheater.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   .addCase(addProduct.pending, (state, action) => {
    //     state.loading = true;
    //     state.error = null;
    //     state.success = false;
    //   })
    //   .addCase(addProduct.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.success = true;
    //     state.products.push(action.payload);
    //   })
    //   .addCase(addProduct.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   })
    //   .addCase(deleteProduct.pending, (state, action) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(deleteProduct.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.products = state.products.filter(
    //       (item) => item.id !== action.payload
    //     );
    //   })
    //   .addCase(deleteProduct.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   })
    //   .addCase(updateProduct.pending, (state, action) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(updateProduct.fulfilled, (state, action) => {
    //     state.loading = false;
    //     let index = state.products.findIndex(
    //       (item) => item.id === action.payload.id
    //     );
    //     if (index !== -1) {
    //       state.products[index] = action.payload;
    //     }
    //   })
    //   .addCase(updateProduct.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   })
    //   .addCase(fetchProductById.pending, (state, action) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchProductById.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.currentProduct = action.payload;
    //   })
    //   .addCase(fetchProductById.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   });
  },
});
export const {} = movieTheaterSlice.actions;
export default movieTheaterSlice.reducer;
