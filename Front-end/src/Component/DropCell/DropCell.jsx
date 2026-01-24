import { useDroppable } from "@dnd-kit/core";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

const CLEANUP = 15;

export default function DropCell({ roomId, showtimes, hour, minute, date }) {
  console.log("ROOM", roomId, "SHOWTIMES", showtimes);
  const dropId = `${roomId}-${hour}-${minute}`;
  const toSlot = (time) => {
    const m = time.minute();
    return m < 30 ? 0 : 30;
  };

  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
  });

  const cellTime = dayjs(date).hour(hour).minute(minute).second(0);

  const startShowtime = showtimes?.find((s) => {
    const st = dayjs(s.startTime);

    return st.hour() === hour && toSlot(st) === minute;
  });

  const isBlocked = showtimes?.some((s) => {
    const start = dayjs(s.startTime);
    const end = start.add(s.movie.duration + CLEANUP, "minute");

    return cellTime.isSameOrAfter(start) && cellTime.isBefore(end);
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        border h-16 flex justify-center items-center
        ${isOver ? "bg-green-200" : ""}
        ${isBlocked ? "bg-red-200" : ""}
      `}
    >
      {startShowtime && (
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
          {startShowtime.movie.title}
        </div>
      )}
    </div>
  );
}
