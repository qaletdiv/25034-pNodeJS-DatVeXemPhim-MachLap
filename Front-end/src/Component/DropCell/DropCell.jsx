import { useDroppable } from "@dnd-kit/core";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import DraggableShowtime from "../DraggableShowtime/DraggableShowtime";

dayjs.extend(isSameOrAfter);

const CLEANUP = 15;

export default function DropCell({ roomId, showtimes, hour, minute, date }) {
  const dropId = `${roomId}-${hour}-${minute}`;
  const { setNodeRef, isOver } = useDroppable({ id: dropId });

  const cellTime = dayjs(date).hour(hour).minute(minute).second(0);

  const startShowtime = showtimes?.find((s) => {
    const st = dayjs(s.startTime);
    return st.hour() === hour && (st.minute() < 30 ? 0 : 30) === minute;
  });

  const isBlocked = showtimes?.some((s) => {
    const start = dayjs(s.startTime);
    const end = start.add(s.movie.duration + CLEANUP, "minute");
    return cellTime.isSameOrAfter(start) && cellTime.isBefore(end);
  });

  return (
    <div
      ref={setNodeRef}
      className={`border h-16 flex justify-center items-center
    ${isOver ? "bg-green-200" : ""}
    ${isBlocked && !startShowtime ? "bg-red-200" : ""}
  `}
    >
      {startShowtime && <DraggableShowtime showtime={startShowtime} />}
    </div>
  );
}
