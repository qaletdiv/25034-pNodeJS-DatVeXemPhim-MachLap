import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../api/axiosClient";

/* ===== CREATE ORDER ===== */
export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ showtimeId, seatIds }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/orders", {
        showtimeId,
        seatIds,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Tạo order thất bại"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    order: null,
    clientSecret: null,
    error: null,
    confirmPayment: {},
  },

  reducers: {
    clearPayment(state) {
      state.order = null;
      state.clientSecret = null;
      state.error = null;
    },
    setConfirmPayment(state, action) {
      state.confirmPayment = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = {
          id: action.payload.orderId,
          total: action.payload.totalAmount,
        };
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPayment, setConfirmPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
