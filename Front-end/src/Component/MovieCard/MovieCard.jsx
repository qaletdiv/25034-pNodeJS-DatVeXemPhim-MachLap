import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchMovie } from "../../redux/Slices/movieSlice";

const MovieCard = ({ movie }) => {
  const status = useSelector((state) => state.movies.status);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMovie({ status }));
  }, [status, dispatch]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN").replaceAll("/", "-");
  };

  return (
    <div className="group relative">
      <Link to={`/movie/${movie.id}`} className="block">
        {/* Neon Glow */}
        <div
          className="absolute -inset-0.5 rounded-2xl
                     bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400
                     opacity-40 blur-lg
                     group-hover:opacity-100 transition hidden sm:block"
        />

        {/* Card */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900">
          {/* Poster */}
          <img
            src={movie.image}
            alt={movie.title}
            className="
              w-full object-cover
              h-[220px] sm:h-[280px] md:h-[360px]
              transition duration-500
              sm:group-hover:scale-110
            "
          />

          {/* Overlay (Desktop only) */}
          <div
            className="
              absolute inset-0 bg-black/40
              opacity-0 sm:group-hover:opacity-100
              transition duration-300
              hidden sm:flex items-center justify-center
            "
          >
            <button
              className="
                px-6 py-3 rounded-full
                bg-red-500 hover:bg-red-600
                text-white font-semibold
                shadow-lg shadow-red-500/50
              "
            >
              {status === "soon" ? "Xem chi tiết" : "Đặt vé"}
            </button>
          </div>

          {/* Info */}
          <div className="p-3 sm:p-4">
            <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl line-clamp-1">
              {movie.title}
            </h3>

            <p className="text-gray-400 text-xs mt-1">
              <span className="font-bold mr-1">Thời lượng:</span>
              {movie.duration} phút
            </p>

            <p className="text-gray-400 text-xs mt-1">
              <span className="font-bold mr-1">Khởi chiếu:</span>
              {formatDate(movie.release_date)}
            </p>

            {/* Mobile Button */}
            <div className="mt-3 sm:hidden">
              <button
                className="
                  w-full py-2 rounded-lg
                  bg-red-500 text-white font-semibold
                  active:bg-red-600 transition
                "
              >
                {status === "soon" ? "Xem chi tiết" : "Đặt vé"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
