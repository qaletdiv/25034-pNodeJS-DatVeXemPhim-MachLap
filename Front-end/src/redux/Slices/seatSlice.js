import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { axiosClient } from "../../api/axiosClient";

/* ================= FETCH SEATS ================= */
export const fetchSeats = createAsyncThunk(
  "seat/fetchSeats",
  async (showtimeId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/api/seats/showtime/${showtimeId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Lỗi tải ghế");
    }
  }
);

/* ================= HOLD SEAT ================= */
export const holdSeat = createAsyncThunk(
  "seat/holdSeat",
  async (showtimeSeatId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/api/seats/${showtimeSeatId}/hold`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ghế đã được giữ");
    }
  }
);
/* ================= RELEASE SEAT ================= */
export const releaseSeat = createAsyncThunk(
  "seat/releaseSeat",
  async (showtimeSeatId, { rejectWithValue }) => {
    try {
      await axiosClient.post(`/api/seats/${showtimeSeatId}/release`);
      return showtimeSeatId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const seatSlice = createSlice({
  name: "seat",
  initialState: {
    seats: [], // dữ liệu từ server
    selectedSeatIds: [], // ghế user đang chọn
    loading: false,
    error: null,
  },

  reducers: {
    /* ===== SOCKET REALTIME ===== */
    seatReservedRealtime(state, action) {
      const { showtimeSeatId, userId } = action.payload;
      const currentUserId = JSON.parse(localStorage.getItem("currentUser")).id;

      const seat = state.seats.find((s) => s.id === showtimeSeatId);
      if (!seat) return;

      seat.status = "reserved";

      // nếu ghế do user khác giữ → remove khỏi selection
      if (userId !== currentUserId) {
        state.selectedSeatIds = state.selectedSeatIds.filter(
          (id) => id !== showtimeSeatId
        );
      }
    },

    seatReleasedRealtime(state, action) {
      const { showtimeSeatId } = action.payload;

      const seat = state.seats.find((s) => s.id === showtimeSeatId);
      if (seat) seat.status = "available";

      state.selectedSeatIds = state.selectedSeatIds.filter(
        (id) => id !== showtimeSeatId
      );
    },

    seatBookedRealtime(state, action) {
      const { showtimeSeatId } = action.payload;

      const seat = state.seats.find(
        (s) => Number(s.id) === Number(showtimeSeatId)
      );

      if (seat) {
        seat.status = "booked";
      }

      state.selectedSeatIds = [];
    },

    /* ===== LOCAL SELECT (UI ONLY) ===== */
    toggleSelectSeat(state, action) {
      const seatId = action.payload;

      if (state.selectedSeatIds.includes(seatId)) {
        state.selectedSeatIds = state.selectedSeatIds.filter(
          (id) => id !== seatId
        );
      } else {
        state.selectedSeatIds.push(seatId);
      }
    },

    clearSelectedSeats(state) {
      state.selectedSeatIds = [];
    },
  },

  extraReducers: (builder) => {
    builder
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
      .addCase(releaseSeat.fulfilled, (state, action) => {
        const seatId = action.payload;

        const seat = state.seats.find((s) => s.id === seatId);
        if (seat) seat.status = "available";
      });
  },
});

export const {
  seatReservedRealtime,
  seatReleasedRealtime,
  toggleSelectSeat,
  seatBookedRealtime,
  clearSelectedSeats,
} = seatSlice.actions;

export default seatSlice.reducer;
