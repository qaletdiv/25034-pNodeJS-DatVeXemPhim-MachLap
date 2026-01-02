import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/Slices/filterSlice";
import { fetchCategory } from "../../redux/Slices/categorySlice";
import { useEffect } from "react";
import { fetchTheater } from "../../redux/Slices/movieTheaterSlice";

const Filter = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const theaters = useSelector((state) => state.movieTheaters.movieTheaters);

  useEffect(() => {
    dispatch(fetchCategory());
    dispatch(fetchTheater());
  }, [dispatch]);

  return (
    <section className="py-10 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative">
          <select
            onChange={(e) => {
              const value = e.target.value;
              dispatch(
                setFilter(
                  value ? { category: Number(value) } : { category: null }
                )
              );
            }}
            className="appearance-none w-full
               bg-card border border-white/10
               rounded-xl px-6 py-4 pr-12
               text-base"
          >
            <option value="">🎬 Thể loại</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}

            {/* <option value="1">Hành động</option>
            <option value="2">Tình cảm</option> */}
          </select>

          <svg
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
               w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="relative">
          <select
            onChange={(e) => {
              const value = e.target.value;
              dispatch(setFilter(value ? { format: value } : { format: null }));
            }}
            className="appearance-none w-full
               bg-card border border-white/10
               rounded-xl px-6 py-4 pr-12
               text-base"
          >
            <option value="">📽 Định dạng</option>
            <option value="2d">2D</option>
            <option value="3d">3D</option>
          </select>

          <svg
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
               w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="relative">
          <select
            onChange={(e) => {
              const value = e.target.value;
              dispatch(
                setFilter(value ? { theater: value } : { theater: null })
              );
            }}
            className="appearance-none w-full
               bg-card border border-white/10
               rounded-xl px-6 py-4 pr-12
               text-base"
          >
            <option value="">📍 Rạp gần bạn</option>
            {theaters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.city})
              </option>
            ))}
          </select>

          <svg
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
               w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Filter;
