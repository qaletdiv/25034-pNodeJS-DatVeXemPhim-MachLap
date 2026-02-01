import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { fetchMovieCarousel } from "../../redux/Slices/movieSlice";

/* ===== HELPER ===== */
const getYoutubeEmbedUrl = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;

export default function Carousel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);

  const carouselMovies = useSelector(
    (state) => state.movies.carousel,
    shallowEqual,
  );

  useEffect(() => {
    dispatch(fetchMovieCarousel());
  }, [dispatch]);

  /* ===== HANDLERS ===== */
  const handleOpenTrailer = useCallback((trailer) => {
    setTrailerUrl(trailer);
    setOpenTrailer(true);
  }, []);

  const handleCloseTrailer = useCallback(() => {
    setOpenTrailer(false);
    setTrailerUrl(null);
  }, []);

  /* ===== SWIPER CONFIG ===== */
  const swiperConfig = useMemo(
    () => ({
      modules: [Autoplay, Pagination, Navigation],
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: { clickable: true },
      navigation: true,
      className: "h-[360px] sm:h-[420px] md:h-[520px] lg:h-[600px]",
    }),
    [],
  );

  return (
    <>
      {/* ===== CAROUSEL ===== */}
      <section className="relative">
        <Swiper {...swiperConfig}>
          {carouselMovies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div
                className="h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${movie.poster})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                {/* Content */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <span className="inline-block mb-3 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs sm:text-sm">
                      🔥 Phim hot
                    </span>

                    <h1 className="text-2xl sm:text-4xl md:text-6xl text-white font-extrabold mb-3">
                      {movie.title}
                    </h1>

                    <p className="max-w-xl text-gray-300 text-sm sm:text-base mb-6 line-clamp-3">
                      {movie.description}
                    </p>

                    <div className="flex sm:flex-row gap-3 sm:gap-4">
                      <button
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="px-6 py-3 rounded-xl font-semibold
                                   bg-gradient-to-r from-red-500 to-pink-500
                                   shadow-lg shadow-red-500/30
                                   hover:scale-105 transition"
                      >
                        🎟 Đặt vé ngay
                      </button>

                      <button
                        onClick={() => handleOpenTrailer(movie.trailer)}
                        className="px-6 py-3 rounded-xl
                                   bg-white/10 backdrop-blur
                                   border border-white/20
                                   hover:bg-white hover:text-black transition"
                      >
                        ▶ Xem trailer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ===== TRAILER MODAL ===== */}
      {openTrailer && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={handleCloseTrailer}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-10 right-0 text-white text-3xl"
            >
              ✕
            </button>

            {trailerUrl && (
              <iframe
                loading="lazy"
                src={getYoutubeEmbedUrl(trailerUrl)}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full rounded-xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
