import MovieDrag from "../DraggableMovie/DraggableMovie";

export default function MoviePanel({ movies = [] }) {
  return (
    <div className="bg-white p-3 rounded shadow space-y-3">
      <h3 className="font-semibold mb-2">🎬 Danh sách phim</h3>

      {movies.length === 0 && (
        <p className="text-sm text-gray-400">Không có phim</p>
      )}

      {movies.map((m) => (
        <MovieDrag key={m.id} movie={m} />
      ))}
    </div>
  );
}
