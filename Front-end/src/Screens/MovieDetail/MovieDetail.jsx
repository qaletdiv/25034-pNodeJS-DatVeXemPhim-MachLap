import { Play, Clock, Globe } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { fetchMovieById } from "../../redux/Slices/movieSlice";
import ShowtimePicker from "../../component/ShowtimePicker/ShowtimePicker";

const MovieDetail = () => {
  const [openTrailer, setOpenTrailer] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const scheduleRef = useRef(null);
  const status = useSelector((state) => state.movies.status);

  const handleScrollToSchedule = () => {
    scheduleRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    dispatch(fetchMovieById(id));
  }, [dispatch, id]);

  const movie = useSelector((state) => state.movies.currentMovie, shallowEqual);

  const trailerId = useMemo(() => movie?.trailer, [movie]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* ===== HERO ===== */}
      <div className="relative h-[35vh] sm:h-[45vh] md:h-[60vh]">
        <img
          src={movie.image}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 -mt-24 sm:-mt-32 md:-mt-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Poster */}
          <img
            src={movie.image}
            alt={movie.title}
            loading="lazy"
            className="
              w-full max-w-[220px] sm:max-w-[260px] md:w-64
              mx-auto md:mx-0
              rounded-xl shadow-2xl
            "
          />

          {/* Info */}
          <div className="md:col-span-2 space-y-4 md:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-gray-300 text-sm">
              <span className="flex items-center gap-2">
                <Clock size={16} /> {movie.duration} phút
              </span>
              <span className="flex items-center gap-2">
                <Globe size={16} /> {movie.language}
              </span>
              <span className="px-3 py-1 bg-red-600 rounded-full text-xs font-semibold">
                C{movie.age}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {status === "now" && (
                <button
                  onClick={handleScrollToSchedule}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 rounded-lg font-semibold"
                >
                  🎟 Đặt vé
                </button>
              )}

              <button
                onClick={() => setOpenTrailer(true)}
                className="
                  w-full sm:w-auto
                  flex items-center justify-center gap-2
                  px-6 py-3
                  bg-white/10 border border-white/20
                  rounded-lg
                  hover:bg-white/20 transition
                "
              >
                <Play size={18} /> Trailer
              </button>
            </div>

            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Diễn viên: </span>
              {movie.name_character}
            </p>

            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="font-semibold">Mô tả: </span>
              {movie.description}
            </p>
          </div>
        </div>

        {/* Showtime */}
        <div className="mt-10 md:mt-16" ref={scheduleRef}>
          <ShowtimePicker movie={movie} />
        </div>
      </div>

      {/* ===== YOUTUBE POPUP ===== */}
      {openTrailer && trailerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div
            className="absolute inset-0"
            onClick={() => setOpenTrailer(false)}
          />

          <div className="relative w-[95%] max-w-5xl aspect-video bg-black rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenTrailer(false)}
              className="absolute top-3 right-3 z-10 bg-black/70 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              ✕
            </button>

            {/* iframe chỉ render khi openTrailer === true */}
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1`}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
