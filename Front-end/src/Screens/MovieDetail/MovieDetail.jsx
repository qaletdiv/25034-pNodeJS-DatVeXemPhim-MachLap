import { Play, Clock, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import ShowtimePicker from "../../component/ShowtimePicker/ShowtimePicker";
import { useParams } from "react-router-dom";
import { fetchMovie, fetchMovieById } from "../../redux/Slices/movieSlice";
import { useDispatch, useSelector } from "react-redux";

const MovieDetail = () => {
  const [openTrailer, setOpenTrailer] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchMovieById(id));
  }, [dispatch, id]);

  const movie = useSelector((state) => state.movies.currentMovie);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* HERO */}
      <div className="relative h-[60vh]">
        <img src={movie?.poster} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 -mt-40 relative z-10">
        <div className="grid md:grid-cols-3 gap-10">
          <img src={movie.poster} className="w-64 rounded-xl shadow-2xl" />

          <div className="md:col-span-2 space-y-6">
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <div className="flex gap-6 text-gray-300 text-center">
              <span className="flex items-center gap-2">
                <Clock size={18} /> {movie.duration} phút
              </span>
              <span className="flex items-center gap-2">
                <Globe size={18} /> {movie.language}
              </span>
              <span className="px-3 py-1 bg-red-600 rounded-full text-sm">
                {movie.age}+
              </span>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-red-600 rounded-lg">
                🎟 Đặt vé
              </button>

              <button
                onClick={() => setOpenTrailer(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
              >
                <Play size={18} /> Trailer
              </button>
            </div>

            <p className="text-gray-300">{movie.description}</p>
          </div>
        </div>

        <div className="mt-16">
          <ShowtimePicker movie={movie} />
        </div>
      </div>

      {/* ===== YOUTUBE POPUP ===== */}
      {openTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div
            className="absolute inset-0"
            onClick={() => setOpenTrailer(false)}
          />

          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenTrailer(false)}
              className="absolute top-3 right-3 z-10 bg-black/70 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              ✕
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1`}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
