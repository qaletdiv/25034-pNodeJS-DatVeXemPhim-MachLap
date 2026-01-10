import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { fetchMovie } from "../../redux/Slices/movieSlice";

const MovieCard = ({ movie }) => {
  const status = useSelector((state) => state.movies.status);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMovie({ status }));
  }, [status, dispatch]);

  const navigate = useNavigate();
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN").replaceAll("/", "-");
  };

  const handleBooking = () => {};

  return (
    <div className="group relative">
      <Link style={{ textDecoration: "none" }} to={`/movie/${movie.id}`}>
        {/* Neon Glow Border */}
        <div
          className="absolute -inset-0.5 rounded-2xl 
                      bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400
                      opacity-60 blur-lg
                      group-hover:opacity-100 transition duration-300"
        />

        {/* Card */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900">
          {/* Poster */}
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-[360px] object-cover
                     transform group-hover:scale-110 transition duration-500"
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40
                        opacity-0 group-hover:opacity-100
                        transition duration-300 flex items-center justify-center"
          >
            {/* Button */}
            <button
              onClick={handleBooking}
              className="px-6 py-3 rounded-full
                       bg-red-500 hover:bg-red-600
                       text-white font-semibold
                       shadow-lg shadow-red-500/50
                       transform translate-y-4 group-hover:translate-y-0
                       transition duration-300"
            >
              {status === "soon" ? "Xem chi tiết" : "Đặt vé"}
            </button>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="text-white font-semibold text-xl line-clamp-1 tracking-wide">
              {movie.title}
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              <span className="font-bold text-gray-400 mr-2">Thời lượng: </span>
              {movie.duration} phút
            </p>
            <p className="text-gray-400 text-xs mt-1">
              <span className="font-bold text-gray-400 mr-2">Khởi chiếu: </span>{" "}
              {formatDate(movie.release_date)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
