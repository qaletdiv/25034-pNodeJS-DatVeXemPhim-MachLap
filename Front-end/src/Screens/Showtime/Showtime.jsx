import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import Grid from "../../component/Grid/Grid";
import DraggableMovie from "../../component/DraggableMovie/DraggableMovie";
import MovieList from "../../component/MoviePanel/MoviePanel";
import {
  createShowtime,
  fetchGrid,
  fetchTheaters,
} from "../../redux/Slices/showtimeSlice";
import TheaterSelect from "../../component/TheaterSelect/TheaterSelect";
import { fetchMovieAdmin } from "../../redux/Slices/movieSlice";

export default function Showtime() {
  const { theaters, grid } = useSelector((s) => s.showtime);
  const { list: movies } = useSelector((s) => s.movies);
  const [theaterId, setTheater] = useState();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const { open } = useOutletContext();
  const [activeMovie, setActiveMovie] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.cursor = activeMovie ? "grabbing" : "default";

    return () => {
      document.body.style.cursor = "default";
    };
  }, [activeMovie]);

  useEffect(() => {
    dispatch(fetchTheaters());
    dispatch(fetchMovieAdmin());
  }, []);

  useEffect(() => {
    if (theaterId) {
      dispatch(fetchGrid({ theaterId, date }));
    }
  }, [theaterId, date]);

  /* ================= DRAG DROP ================= */
  const handleDragStart = (e) => {
    const movie = movies.find((m) => String(m.id) === e.active.id);
    setActiveMovie(movie);
  };

  const hasConflict = (roomId, start, duration) => {
    const room = grid.find((r) => r.id == roomId);

    if (!room) return false;

    const startNew = dayjs(start);
    const endNew = startNew.add(duration + 15, "minute");

    return room.showtimes.some((s) => {
      const sStart = dayjs(s.startTime);
      const sEnd = sStart.add(s.movie.duration + 15, "minute");

      return startNew.isBefore(sEnd) && endNew.isAfter(sStart);
    });
  };

  const handleDragEnd = async (e) => {
    setActiveMovie(null);
    if (!e.over) return;

    const movieId = e.active.id;
    const [roomId, hour, minute] = e.over.id.split("-");

    const movie = movies.find((m) => m.id == movieId);

    const startTime = dayjs(date)
      .hour(hour)
      .minute(minute)
      .second(0)
      .format("YYYY-MM-DD HH:mm:ss");

    // CHECK LOCAL
    if (hasConflict(roomId, startTime, movie.duration)) {
      toast.error("❌ Trùng giờ / không đủ thời gian dọn phòng");
      return;
    }

    const res = await dispatch(
      createShowtime({
        movieId,
        roomId,
        startTime,
      }),
    );

    if (res.error) {
      if (res.payload.conflict) {
        toast.error("❌ Thời gian giữa 2 suất chiếu quá sát nhau");
      }
    } else {
      toast.success("✔ Tạo suất chiếu thành công");
      dispatch(fetchGrid({ theaterId, date }));
    }
  };

  // const handleDragEnd = async (e) => {
  //   setActiveMovie(null);
  //   if (!e.over) return;

  //   const movieId = e.active.id;
  //   const [roomId, hour] = e.over.id.split("-");

  //   const startTime = dayjs(date)
  //     .hour(hour)
  //     .minute(0)
  //     .second(0)
  //     .format("YYYY-MM-DD HH:mm:ss");

  //   const res = await dispatch(
  //     createShowtime({
  //       movieId,
  //       roomId,
  //       startTime,
  //     }),
  //   );

  //   console.log(res, "tesssssssss");

  //   if (res.error) {
  //     if (res.payload.conflict) {
  //       toast.error("❌ Thời gian giữa 2 suất chiếu quá sát nhau");
  //     }
  //   } else {
  //     toast.success("Tạo suất chiếu thành công");
  //     dispatch(fetchGrid({ theaterId, date }));
  //   }
  // };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <main
        className={`flex-1 transition-all ${
          open ? "ml-64" : "ml-16"
        } p-6 space-y-6`}
      >
        <div className="p-6 bg-gray-100">
          <div className="flex gap-4 mb-4">
            <TheaterSelect list={theaters} onChange={setTheater} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-4 gap-6">
            <MovieList movies={movies} />

            <div className="col-span-3">
              <Grid rooms={grid} date={date} />
            </div>
          </div>
        </div>

        {/* DRAG OVERLAY FIX SCROLL BUG */}
        <DragOverlay>
          {activeMovie && (
            <div className="flex gap-3 bg-white p-2 rounded shadow opacity-65">
              <img
                src={activeMovie.poster}
                className="w-12 h-16 object-cover"
              />
              <p>{activeMovie.title}</p>
            </div>
          )}
        </DragOverlay>
      </main>
    </DndContext>
  );
}
