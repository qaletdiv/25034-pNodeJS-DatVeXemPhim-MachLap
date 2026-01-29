import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../api/axiosClient";

export const fetchGrid = createAsyncThunk(
  "showtime/grid",
  async ({ theaterId, date }) => {
    if (!theaterId) return [];
    const res = await axiosClient.get(
      `/api/showtimes/grid?theaterId=${theaterId}&date=${date}`,
    );
    return res.data;
  },
);

export const fetchTheaters = createAsyncThunk(
  "showtime/fetchTheaters",
  async () => {
    const res = await axiosClient.get("/api/showtimes/theaters");
    return res.data;
  },
);

export const createShowtime = createAsyncThunk(
  "showtime/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/showtimes", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const updateShowtime = createAsyncThunk(
  "showtime/update",
  async ({ id, roomId, startTime }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/api/showtimes/${id}`, {
        roomId,
        startTime,
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

const slice = createSlice({
  name: "showtime",
  initialState: {
    theaters: [],
    grid: [],
    loading: false,
    error: null,
  },
  extraReducers: (b) => {
    b.addCase(fetchGrid.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchGrid.fulfilled, (s, a) => {
        s.loading = false;
        s.error = null;
        s.grid = a.payload;
      })
      .addCase(fetchGrid.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })
      .addCase(fetchTheaters.fulfilled, (s, a) => {
        s.theaters = a.payload;
      })
      .addCase(createShowtime.fulfilled, (s) => {})
      .addCase(updateShowtime.fulfilled, (s) => {});
  },
});

export default slice.reducer;
