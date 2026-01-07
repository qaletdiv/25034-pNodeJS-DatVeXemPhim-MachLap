import { useMemo, useState } from "react";

/* ================== CONFIG ================== */
const SEAT_TYPES = {
  NORMAL: { label: "Thường", color: "bg-white text-black", price: 70000 },
  VIP: { label: "VIP", color: "bg-yellow-400 text-black", price: 100000 },
  SWEETBOX: {
    label: "Sweetbox",
    color: "bg-pink-500 text-white",
    price: 180000,
  },
};

/* ================== MOCK DATA ================== */
// Mô phỏng ghế giống rạp thật (13 ghế / hàng)
const generateSeats = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const seats = [];

  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= 13; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type: rowIndex >= 5 ? "VIP" : rowIndex === 6 ? "SWEETBOX" : "NORMAL",
        sold: Math.random() < 0.15,
      });
    }
  });

  // Sweetbox hàng cuối
  seats.push(
    { id: "H1", row: "H", number: "01-02", type: "SWEETBOX", sold: false },
    { id: "H2", row: "H", number: "03-04", type: "SWEETBOX", sold: true },
    { id: "H3", row: "H", number: "05-06", type: "SWEETBOX", sold: false }
  );

  return seats;
};

const seatsData = generateSeats();

/* ================== COMPONENT ================== */
export default function SeatSelect() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  /* Group ghế theo hàng */
  const seatsByRow = useMemo(() => {
    return seatsData.reduce((acc, seat) => {
      acc[seat.row] = acc[seat.row] || [];
      acc[seat.row].push(seat);
      return acc;
    }, {});
  }, []);

  const toggleSeat = (seat) => {
    if (seat.sold) return;

    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((s) => s !== seat.id)
        : [...prev, seat.id]
    );
  };

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, id) => {
      const seat = seatsData.find((s) => s.id === id);
      return sum + SEAT_TYPES[seat.type].price;
    }, 0);
  }, [selectedSeats]);

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white px-6 py-10">
      {/* ================= INFO ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Avatar: The Way of Water</h1>
        <p className="text-gray-400 mt-1">Phòng 1 • 03/01/2026 • 20:00</p>
      </div>

      {/* ================= SCREEN ================= */}
      <div className="mb-10">
        <div className="h-3 w-full bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 rounded-full mb-2" />
        <p className="text-center text-sm tracking-widest text-gray-400">
          MÀN HÌNH
        </p>
      </div>

      {/* ================= SEAT MAP ================= */}
      <div className="space-y-3 mb-12 overflow-x-auto">
        <div className="min-w-max">
          {Object.entries(seatsByRow).map(([row, seats]) => (
            <div
              key={row}
              className="flex items-center justify-center gap-4 mt-3"
            >
              {/* Row label */}
              <span className="w-6 text-gray-400 font-semibold">{row}</span>

              {/* Seats */}
              <div
                className="grid gap-3 grid-cols-[repeat(6,32px)_48px_repeat(7,32px)] md:grid-cols-[repeat(6,40px)_60px_repeat(7,40px)]
  "
              >
                {seats.map((seat) => {
                  const isSelected = selectedSeats.includes(seat.id);

                  let color = SEAT_TYPES[seat.type].color;
                  if (seat.sold) color = "bg-gray-600 text-white";
                  if (isSelected) color = "bg-green-500 text-white";

                  const isSweetbox = seat.type === "SWEETBOX";

                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      disabled={seat.sold}
                      className={`
  ${isSweetbox ? "col-span-2" : ""}
  w-8 h-8 text-[10px]
  md:w-10 md:h-10 md:text-xs
  rounded-lg font-semibold
  flex items-center justify-center
  ${color}
  ${seat.sold ? "cursor-not-allowed" : "hover:scale-105"}
  transition
`}
                    >
                      {seat.sold ? "✕" : seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= LEGEND ================= */}
      <div className="flex flex-wrap gap-6 text-sm mb-10">
        <Legend color="bg-white" label="Ghế thường" />
        <Legend color="bg-yellow-400" label="Ghế VIP" />
        <Legend color="bg-pink-500" label="Sweetbox" />
        <Legend color="bg-gray-600" label="Đã bán" />
        <Legend color="bg-green-500" label="Đang chọn" />
      </div>

      {/* ================= TOTAL ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#151520] p-6 rounded-2xl shadow-lg">
        <div>
          <p className="text-gray-400 text-sm">Ghế đã chọn</p>
          <p className="font-semibold">
            {selectedSeats.length > 0
              ? selectedSeats.join(", ")
              : "Chưa chọn ghế"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-400 text-sm">Tổng tiền</p>
          <p className="text-2xl font-bold text-red-500">
            {totalPrice.toLocaleString()}đ
          </p>
          <button className="mt-3 px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================== LEGEND ================== */
const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded ${color}`} />
    <span>{label}</span>
  </div>
);
