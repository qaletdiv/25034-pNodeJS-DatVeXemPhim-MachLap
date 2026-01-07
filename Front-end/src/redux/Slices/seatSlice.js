import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../api/axiosClient";

export const fetchSeats = createAsyncThunk(
  "seat/fetchSeats",
  async (showtimeId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/api/seats/${showtimeId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tải ghế");
    }
  }
);

export const holdSeat = createAsyncThunk(
  "seat/holdSeat",
  async (showtimeSeatId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/seats/hold", { showtimeSeatId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Ghế đã được chọn");
    }
  }
);

const seatSlice = createSlice({
  name: "seat",
  initialState: {
    seats: [],
    loading: false,
    error: null,
  },

  reducers: {
    // realtime socket
    seatReservedRealtime(state, action) {
      const seat = state.seats.find(
        (s) => s.showtimeSeatId === action.payload.showtimeSeatId
      );
      if (seat) seat.status = "reserved";
    },
    seatReleasedRealtime(state, action) {
      const seat = state.seats.find((s) => s.id === action.payload);
      if (seat) seat.status = "available";
    },
  },

  extraReducers: (builder) => {
    builder
      /* ========== FETCH SEATS ========== */
      .addCase(fetchSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ========== HOLD SEAT ========== */
      .addCase(holdSeat.pending, (state) => {
        state.loading = true;
      })
      .addCase(holdSeat.fulfilled, (state, action) => {
        state.loading = false;
        // socket has been updated realtime so no update state here
      })
      .addCase(holdSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { seatReservedRealtime, seatReleasedRealtime } = seatSlice.actions;

export default seatSlice.reducer;
