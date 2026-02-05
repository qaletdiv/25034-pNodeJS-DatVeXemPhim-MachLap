import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";

import MovieCard from "../MovieCard/MovieCard";
import { fetchMovie, setStatus } from "../../redux/Slices/movieSlice";

const MovieGrid = () => {
  const status = useSelector((state) => state.movies.status);
  const movies = useSelector((state) => state.movies.movies, shallowEqual);
  console.log(movies, "movieeeeeeeee");

  const dispatch = useDispatch();

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-6 mb-10">
          <button
            onClick={() => {
              dispatch(setStatus("now"));
            }}
            className={`px-6 py-2 rounded-full ${
              status === "now"
                ? "bg-red-500 shadow-lg shadow-red-500/30"
                : "bg-white/10"
            }`}
          >
            Phim đang chiếu
          </button>

          <button
            onClick={() => {
              dispatch(setStatus("soon"));
            }}
            className={`px-6 py-2 rounded-full ${
              status === "soon"
                ? "bg-red-500 shadow-lg shadow-red-500/30"
                : "bg-white/10"
            }`}
          >
            Phim sắp chiếu
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* (tab === "now" ? nowShowing : comingSoon) */}
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieGrid;
