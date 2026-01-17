import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  fetchSeats,
  holdSeat,
  toggleSelectSeat,
  releaseSeat,
  clearSelectedSeats,
} from "../../redux/Slices/seatSlice";

import useSeatSocket from "../../hooks/useSeatSocket";

export default function Seat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showtimeId } = useParams();

  const seats = useSelector((state) => state.seats.seats);
  const selectedSeatIds = useSelector((state) => state.seats.selectedSeatIds);

  const { loading } = useSelector((state) => state.seats);

  useEffect(() => {
    dispatch(fetchSeats(showtimeId));
  }, [dispatch, showtimeId]);

  const currentMovie = useSelector((state) => state.movies.currentMovie);

  const currentShowtime = currentMovie?.showtimes?.find(
    (item) => Number(item.id) == showtimeId
  );

  const theater = currentShowtime?.room?.movietheater?.name;

  function calculateEndTime(startTime, duration) {
    if (!startTime || !duration) return "";

    // xử lý nếu backend trả "18:30:00"
    const time = startTime.slice(0, 5);

    const [hours, minutes] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) return "";

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + Number(duration));

    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  }

  const formatTimeHHMM = (timeString) => {
    if (!timeString) return "";

    const date = new Date(timeString);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };
  const priceBase = currentShowtime?.price;

  console.log(currentShowtime?.room?.name, "curmooooo");

  useSeatSocket(showtimeId);

  /* ===== GHẾ ĐƯỢC CHỌN ===== */
  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));

  /* ===== TỔNG TIỀN ===== */
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => {
      if (seat.seat.type === "vip") return sum + 120000;
      if (seat.seat.type === "couple") return sum + 200000;
      return sum + Number(priceBase);
    }, 0);
  }, [selectedSeats]);

  /* ===== CLICK GHẾ ===== */
  const handleSelectSeat = async (seat) => {
    // if (seat.status !== "available") return;

    // const res = await dispatch(holdSeat(seat.id));

    // if (holdSeat.fulfilled.match(res)) {
    //   dispatch(toggleSelectSeat(seat.id));
    // }

    // Đã bán thì không cho bấm
    if (seat.status === "booked") return;

    const isSelected = selectedSeatIds.includes(seat.id);

    /* ========== BỎ CHỌN ========== */
    if (isSelected) {
      dispatch(toggleSelectSeat(seat.id));
      dispatch(releaseSeat(seat.id));
      return;
    }

    /* ========== CHỌN MỚI ========== */
    if (seat.status !== "available") return;

    const res = await dispatch(holdSeat(seat.id));

    // chỉ khi BE giữ ghế thành công
    if (holdSeat.fulfilled.match(res)) {
      dispatch(toggleSelectSeat(seat.id));
    }
  };

  /* ===== STYLE GHẾ ===== */
  const seatStyle = (seat) => {
    if (seat.status === "booked")
      return "bg-gray-600 text-white cursor-not-allowed";
    if (selectedSeatIds.includes(seat.id)) return "bg-green-500 text-white";

    if (seat.status === "reserved") return "bg-gray-400 text-white";

    if (seat.seat?.type === "vip") return "bg-yellow-400 text-black";

    if (seat.seat?.type === "couple") return "bg-pink-400 text-black";

    return "bg-white text-black";
  };

  const handleCheckout = () => {
    if (!selectedSeatIds.length) return;

    // Lưu tạm để checkout dùng
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        showtimeId,
        seatIds: selectedSeatIds,
        seats: selectedSeats.map((s) => s.seat.seatNumber),
        totalPrice,
        movieTitle: currentMovie.title,
        showtime: formatTimeHHMM(currentShowtime.startTime),
      })
    );

    navigate("/checkout");
  };

  if (loading) {
    return <div className="text-center mt-20">Đang tải ghế...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      {/* ===== THÔNG TIN SUẤT CHIẾU ===== */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          <span className="text-red-600">RẠP:</span> {theater && theater}
        </h1>
        <h3 className="text-3xl font-bold my-2">
          {" "}
          <span className="text-red-600">Phim:</span> {currentMovie?.title}
        </h3>
        <p className="text-gray-400">
          {currentShowtime?.room?.name} • {""}
          {formatTimeHHMM(currentShowtime?.startTime)} -{" "}
          {calculateEndTime(
            formatTimeHHMM(currentShowtime?.startTime),
            Number(currentMovie?.duration)
          )}
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
            disabled={
              seat.status === "booked" ||
              (seat.status === "reserved" && !selectedSeatIds.includes(seat.id))
            }
            // disabled={seat.status === "booked"}
            className={`
              w-10 h-10 rounded text-xs font-bold
              flex items-center justify-center
              transition-all
              ${seatStyle(seat)}
            `}
          >
            {seat.status === "booked" ? "X" : seat.seat?.seatNumber}
          </button>
        ))}
      </div>

      {/* ===== CHÚ THÍCH ===== */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <Legend color="bg-white" text="Ghế thường" />
        <Legend color="bg-yellow-400" text="Ghế VIP" />
        <Legend color="bg-pink-400" text="Sweetbox" />
        <Legend color="bg-green-500" text="Đang chọn" />
        <Legend color="bg-gray-600" text="Đã bán" />
        <Legend color="bg-gray-400" text="Người khác đang giữ ghế" />
      </div>

      {/* ===== BẢNG GIÁ ===== */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 flex justify-between items-center">
        <div>
          <p className="text-gray-400">Ghế đã chọn</p>
          <p>{selectedSeats.map((s) => s.seat.seatNumber).join(", ") || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400">Tổng tiền</p>
          <p className="text-2xl font-bold text-green-400">
            {totalPrice.toLocaleString()} ₫
          </p>
        </div>

        <button
          disabled={!selectedSeatIds.length}
          onClick={handleCheckout}
          className="bg-red-600 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span>{text}</span>
    </div>
  );
}
