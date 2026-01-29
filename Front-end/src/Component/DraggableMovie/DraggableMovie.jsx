// import { useDraggable } from "@dnd-kit/core";

// export default function DraggableMovie({ movie }) {
//   const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
//     id: String(movie.id),
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       {...listeners}
//       {...attributes}
//       style={{
//         opacity: isDragging ? 0.3 : 1, // Ẩn card gốc
//         cursor: isDragging ? "grabbing" : "grab",
//       }}
//       className="flex gap-3 bg-white p-2 rounded shadow cursor-grab active:cursor-pointer"
//     >
//       <img src={movie.poster} className="w-12 h-16 object-cover" />
//       <p>{movie.title}</p>
//     </div>
//   );
// }

// DraggableMovie.jsx
import { useDraggable } from "@dnd-kit/core";

export default function DraggableMovie({ movie }) {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: `movie-${movie.id}`,
    data: { type: "movie", movie },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.3 : 1 }}
      className="flex gap-3 bg-white p-2 rounded shadow cursor-grab"
    >
      <img src={movie.poster} className="w-12 h-16 object-cover" />
      <p>{movie.title}</p>
    </div>
  );
}
