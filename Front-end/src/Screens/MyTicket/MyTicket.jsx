import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import dayjs from "dayjs";
import { axiosClient } from "../../api/axiosClient";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await axiosClient.get("/api/my-tickets", {
      withCredentials: true,
    });

    setTickets(res.data);

    const paid = res.data.filter((t) => t.order.status === "paid");
    const total = paid.reduce((sum, t) => sum + Number(t.price), 0);

    setTotalSpent(total);
  };

  const canCancel = (startTime) => {
    return dayjs(startTime).diff(dayjs(), "minute") > 60;
  };

  /* OPEN MODAL */
  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setOpenModal(true);
  };

  /* CONFIRM CANCEL */
  const confirmCancel = async () => {
    await axiosClient.post(
      `/api/orders/${cancelOrderId}/cancel`,
      {},
      { withCredentials: true }
    );

    setOpenModal(false);
    setCancelOrderId(null);
    fetchTickets();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-20">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎟 Vé của tôi</h1>

          <div className="bg-[#1a1a1a] px-5 py-3 rounded-xl">
            <p className="text-sm text-gray-400">Tổng chi tiêu</p>
            <p className="text-xl font-bold text-green-400">
              {totalSpent.toLocaleString()} ₫
            </p>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-5">
          {tickets.map((t) => {
            const showtime = t.order.showtime;

            return (
              <div
                key={t.id}
                className="
                bg-[#1a1a1a] rounded-xl p-5
                grid gap-5
                md:grid-cols-3
                hover:scale-[1.01]
                transition-transform
                "
              >
                {/* QR */}
                <div className="flex justify-center">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCode value={`ORDER-${t.order.id}`} size={120} />
                  </div>
                </div>

                {/* INFO */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg">
                      {showtime.movie.title}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs
                      ${
                        t.order.status === "paid"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {t.order.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400">🎟 Mã vé: #{t.id}</p>

                  <p>
                    🕒 {dayjs(showtime.startTime).format("HH:mm DD/MM/YYYY")}
                  </p>

                  <p>
                    🏢 Phòng: {showtime.room.name} –{" "}
                    {showtime.room.movietheater.name}
                  </p>

                  <p>💺 Ghế: {t.showtimeSeat.seat.seatNumber}</p>

                  <p className="text-green-400 font-semibold">
                    {Number(t.price).toLocaleString()} ₫
                  </p>

                  <p className="text-yellow-400 text-sm italic">
                    👉 Đưa mã này cho nhân viên soát vé
                  </p>

                  {/* CANCEL */}
                  {t.order.status === "paid" &&
                    canCancel(showtime.startTime) && (
                      <button
                        onClick={() => openCancelModal(t.order.id)}
                        className="
                        mt-3 bg-red-600 px-4 py-2
                        rounded-lg
                        hover:bg-red-700
                        transition"
                      >
                        Hủy vé
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {openModal && (
        <div
          className="
        fixed inset-0 z-50
        bg-black/60
        flex items-center justify-center
        p-4
        "
        >
          <div
            className="
            bg-[#111] rounded-2xl
            max-w-sm w-full
            p-6 space-y-5
            animate-fadeIn
            "
          >
            <h3 className="text-xl font-bold text-center">⚠ Xác nhận hủy vé</h3>

            <p className="text-gray-400 text-center text-sm">
              Bạn chắc chắn muốn hủy vé này? Hành động không thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="
                flex-1
                border border-gray-600
                py-2 rounded-lg
                hover:bg-gray-800
                transition
                "
              >
                Quay lại
              </button>

              <button
                onClick={confirmCancel}
                className="
                flex-1
                bg-red-600
                py-2 rounded-lg
                hover:bg-red-700
                transition
                "
              >
                Hủy vé
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
