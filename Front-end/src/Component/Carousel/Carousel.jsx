import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../index.css";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchMovieCarousel } from "../../redux/Slices/movieSlice";
import { useNavigate } from "react-router-dom";

/* ===== HELPER: YOUTUBE EMBED ===== */
const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";
  const videoId = url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
};

const Carousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    dispatch(fetchMovieCarousel());
  }, [dispatch]);

  const carouselMovies = useSelector((state) => state.movies.carousel);

  return (
    <div>
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 3000 }}
          loop
          pagination={{ clickable: true }}
          navigation
          className="h-[560px]"
        >
          {carouselMovies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div
                className="h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${movie.poster})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

                {/* Content */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-6">
                    <span className="inline-block mb-4 px-4 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                      🔥 Phim hot
                    </span>

                    <h1 className="text-4xl md:text-6xl text-white font-extrabold mb-4">
                      {movie.title}
                    </h1>

                    <p className="max-w-xl text-gray-300 mb-8">
                      {movie.description}
                    </p>

                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="px-8 py-3 rounded-xl font-semibold
                                   bg-gradient-to-r from-red-500 to-pink-500
                                   shadow-lg shadow-red-500/30
                                   hover:scale-105 transition"
                      >
                        🎟 Đặt vé ngay
                      </button>

                      <button
                        onClick={() => {
                          setTrailerUrl(movie.trailer);
                          setOpenTrailer(true);
                        }}
                        className="px-8 py-3 rounded-xl
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

      {/* ===== TRAILER POPUP ===== */}
      {openTrailer && (
        <div
          className="fixed inset-0 z-50 bg-black/80
                     flex items-center justify-center"
          onClick={() => setOpenTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setOpenTrailer(false)}
              className="absolute -top-10 right-0 text-white text-3xl"
            >
              ✕
            </button>

            <iframe
              src={getYoutubeEmbedUrl(trailerUrl)}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
