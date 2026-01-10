import { useEffect, useRef } from "react";
import { socket } from "../socket/socket";
import { useDispatch } from "react-redux";

import {
  seatReservedRealtime,
  seatReleasedRealtime,
} from "../redux/Slices/seatSlice";

export default function useSeatSocket(showtimeId) {
  const dispatch = useDispatch();
  const currentRoom = useRef(null);

  useEffect(() => {
    if (!showtimeId) return;

    /* ===== CONNECT 1 LẦN ===== */
    if (!socket.connected) {
      socket.connect();
    }

    /* ===== LEAVE ROOM CŨ ===== */
    if (currentRoom.current) {
      socket.emit("leave_showtime", currentRoom.current);
    }

    /* ===== JOIN ROOM MỚI ===== */
    socket.emit("join_showtime", showtimeId);
    currentRoom.current = showtimeId;

    /* ===== LISTEN EVENTS ===== */
    const onReserved = (data) => {
      dispatch(seatReservedRealtime(data));
    };
    // const onReserved = (data) => {
    //   const currentUserId = JSON.parse(localStorage.getItem("currentUser")).id;
    //   dispatch(
    //     seatReservedRealtime({
    //       ...data,
    //       currentUserId,
    //     })
    //   );
    // };

    const onReleased = (data) => {
      dispatch(seatReleasedRealtime(data));
    };

    socket.on("seat_reserved", onReserved);
    socket.on("seat_released", onReleased);

    return () => {
      socket.off("seat_reserved", onReserved);
      socket.off("seat_released", onReleased);
    };
  }, [showtimeId, dispatch]);
}
