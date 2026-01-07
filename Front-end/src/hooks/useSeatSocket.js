import { useEffect } from "react";
import { socket } from "../socket/socket";
import { useDispatch } from "react-redux";
import {
  seatReservedRealtime,
  seatReleasedRealtime,
} from "../redux/Slices/seatSlice";

export default function useSeatSocket(showtimeId) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!showtimeId) return;

    // chỉ join room, KHÔNG connect/disconnect
    socket.emit("join_showtime", showtimeId);

    const onSeatReserved = (data) => {
      dispatch(seatReservedRealtime(data));
    };

    const onSeatReleased = (data) => {
      dispatch(seatReleasedRealtime(data));
    };

    socket.on("seat_reserved", onSeatReserved);
    socket.on("seat_released", onSeatReleased);

    return () => {
      socket.off("seat_reserved", onSeatReserved);
      socket.off("seat_released", onSeatReleased);
    };
  }, [showtimeId, dispatch]);
}
