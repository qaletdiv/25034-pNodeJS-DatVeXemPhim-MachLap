import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeats, holdSeat } from "../../redux/Slices/seatSlice";
import useSeatSocket from "../../hooks/useSeatSocket";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

export default function Seat() {
  const dispatch = useDispatch();
  const { showtimeId } = useParams();

  const { seats, loading } = useSelector((state) => state.seats);
  console.log(seats, "testt seat");

  const [selectedSeats, setSelectedSeats] = useState([]);

  useSeatSocket(showtimeId);

  useEffect(() => {
    dispatch(fetchSeats(showtimeId));
  }, [dispatch, showtimeId]);

  /* ===== TỔNG TIỀN ===== */
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  /* ===== CLICK GHẾ ===== */
  const handleSelectSeat = (seat) => {
    if (seat.status !== "available") return;

    dispatch(holdSeat(seat.id));

    setSelectedSeats((prev) => {
      const exist = prev.find((s) => s.id === seat.id);

      if (exist) {
        return prev.filter((s) => s.id !== seat.id);
      }

      return [...prev, seat];
    });
  };

  /* ===== STYLE GHẾ ===== */
  const seatStyle = (seat) => {
    if (seat.status === "booked")
      return "bg-gray-500 text-white cursor-not-allowed";

    if (selectedSeats.find((s) => s.id === seat.id))
      return "bg-green-500 text-white";

    if (seat.Seat.type === "vip") return "bg-yellow-400";
    if (seat.Seat.type === "couple") return "bg-pink-400";

    return "bg-white";
  };

  if (loading) {
    return <div className="text-center mt-20">Đang tải ghế...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      {/* ===== THÔNG TIN SUẤT CHIẾU ===== */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🎬 Avengers: Endgame</h1>
        <p className="text-gray-400">
          Phòng 1 • {dayjs().format("HH:mm DD/MM/YYYY")}
        </p>
      </div>

      {/* ===== MÀN HÌNH ===== */}
      <div className="mb-6">
        <div className="bg-gray-700 text-center py-2 rounded">MÀN HÌNH</div>
      </div>

      {/* ===== SƠ ĐỒ GHẾ ===== */}
      <div className="grid grid-cols-8 gap-3 justify-center mb-10">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => handleSelectSeat(seat)}
            disabled={seat.status !== "available"}
            className={`
              w-10 h-10 rounded text-xs font-bold
              flex items-center justify-center
              ${seatStyle(seat)}
            `}
          >
            {seat.status === "booked" ? "X" : seat?.Seat?.seatNumber}
          </button>
        ))}
      </div>

      {/* ===== CHÚ THÍCH ===== */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <Legend color="bg-white" text="Ghế thường" />
        <Legend color="bg-yellow-400" text="Ghế VIP" />
        <Legend color="bg-pink-400" text="Sweetbox" />
        <Legend color="bg-green-500" text="Đang chọn" />
        <Legend color="bg-gray-500" text="Đã bán" />
      </div>

      {/* ===== BẢNG GIÁ ===== */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 flex justify-between items-center">
        <div>
          <p className="text-gray-400">Ghế đã chọn</p>
          <p>{selectedSeats.map((s) => s.Seat.seatNumber).join(", ")}</p>
        </div>

        <div>
          <p className="text-gray-400">Tổng tiền</p>
          <p className="text-2xl font-bold text-green-400">
            {totalPrice.toLocaleString()} ₫
          </p>
        </div>

        <button
          disabled={!selectedSeats.length}
          className="bg-red-600 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}

/* ===== COMPONENT NOTICE ===== */
function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span>{text}</span>
    </div>
  );
}
