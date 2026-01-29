import { useDraggable } from "@dnd-kit/core";

export default function DraggableShowtime({ showtime }) {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: `showtime-${showtime.id}`,
    data: { type: "showtime", showtime },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        w-full h-full
        bg-red-500 text-white text-xs
        flex items-center justify-center
        rounded
        cursor-move
        ${isDragging ? "opacity-40" : ""}
      `}
    >
      <span className="px-2 text-center leading-tight">
        {showtime.movie.title}
      </span>
    </div>
  );
}
