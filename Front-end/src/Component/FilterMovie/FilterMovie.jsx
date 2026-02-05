import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { setFilter } from "../../redux/Slices/filterSlice";
import { fetchCategory } from "../../redux/Slices/categorySlice";
import { fetchTheater } from "../../redux/Slices/movieTheaterSlice";
import Icon from "../Icon/IconMenuDropdown";

const FilterMovie = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const theaters = useSelector((state) => state.movieTheaters.movieTheaters);
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    dispatch(fetchCategory());
    dispatch(fetchTheater());
  }, [dispatch]);

  useEffect(() => {
    console.log("FILTER STATE:", filters);
  }, [filters]);

  return (
    <section className="py-10 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative">
          <select
            value={filters.category || ""}
            onChange={(e) => {
              const value = e.target.value;
              dispatch(
                setFilter(
                  value ? { category: Number(value) } : { category: null },
                ),
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
          </select>

          <Icon />
        </div>

        <div className="relative">
          <select
            value={filters.format || ""}
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

          <Icon />
        </div>

        <div className="relative">
          <select
            value={filters.theater || ""}
            onChange={(e) => {
              const value = e.target.value;
              dispatch(
                setFilter(
                  value ? { theater: Number(value) } : { theater: null },
                ),
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

          <Icon />
        </div>
      </div>
    </section>
  );
};

export default FilterMovie;

// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";

// import { setFilter } from "../../redux/Slices/filterSlice";
// import { fetchCategory } from "../../redux/Slices/categorySlice";
// import { fetchTheater } from "../../redux/Slices/movieTheaterSlice";
// import Icon from "../Icon/IconMenuDropdown";

// const FilterMovie = () => {
//   const dispatch = useDispatch();

//   const categories = useSelector((state) => state.categories.categories);
//   const theaters = useSelector((state) => state.movieTheaters.movieTheaters);
//   const filters = useSelector((state) => state.filters); // ⭐ QUAN TRỌNG

//   useEffect(() => {
//     dispatch(fetchCategory());
//     dispatch(fetchTheater());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("FILTER STATE:", filters);
//   }, [filters]);

//   return (
//     <section className="py-10 bg-[#0f172a]">
//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
//         {/* ===== CATEGORY ===== */}
//         <div className="relative">
//           <select
//             value={filters.category ?? ""}
//             onChange={(e) => {
//               const value = e.target.value;
//               dispatch(
//                 setFilter({
//                   key: "category",
//                   value: value ? Number(value) : null,
//                 }),
//               );
//             }}
//             className="appearance-none w-full
//               bg-card border border-white/10
//               rounded-xl px-6 py-4 pr-12
//               text-base"
//           >
//             <option value="">🎬 Thể loại</option>
//             {categories.map((item) => (
//               <option key={item.id} value={item.id}>
//                 {item.name}
//               </option>
//             ))}
//           </select>
//           <Icon />
//         </div>

//         {/* ===== FORMAT ===== */}
//         <div className="relative">
//           <select
//             value={filters.format ?? ""}
//             onChange={(e) => {
//               const value = e.target.value;
//               dispatch(
//                 setFilter({
//                   key: "format",
//                   value: value || null,
//                 }),
//               );
//             }}
//             className="appearance-none w-full
//               bg-card border border-white/10
//               rounded-xl px-6 py-4 pr-12
//               text-base"
//           >
//             <option value="">📽 Định dạng</option>
//             <option value="2d">2D</option>
//             <option value="3d">3D</option>
//           </select>
//           <Icon />
//         </div>

//         {/* ===== THEATER ===== */}
//         <div className="relative">
//           <select
//             value={filters.theater ?? ""}
//             onChange={(e) => {
//               const value = e.target.value;
//               dispatch(
//                 setFilter({
//                   ...filters,
//                   theater: value ? Number(value) : null,
//                 }),
//               );
//             }}
//             className="appearance-none w-full
//               bg-card border border-white/10
//               rounded-xl px-6 py-4 pr-12
//               text-base"
//           >
//             <option value="">📍 Rạp gần bạn</option>
//             {theaters.map((item) => (
//               <option key={item.id} value={item.id}>
//                 {item.name} ({item.city})
//               </option>
//             ))}
//           </select>
//           <Icon />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FilterMovie;
