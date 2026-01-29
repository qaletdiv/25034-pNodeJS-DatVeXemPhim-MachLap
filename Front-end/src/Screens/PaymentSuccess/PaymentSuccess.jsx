import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { clearSelectedSeats } from "../../redux/Slices/seatSlice";
import dayjs from "dayjs";

const PaymentSuccess = () => {
  const paymentData = useSelector((state) => state.orders.confirmPayment);
  console.log(paymentData, "tesstttttt");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = JSON.parse(localStorage.getItem("currentUser")).name;
  const seatName = paymentData?.tickets?.map(
    (item) => item.showtimeSeat.seat.seatNumber,
  );
  useEffect(() => {
    dispatch(clearSelectedSeats());
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8">
        {/* Icon */}
        <div className="flex justify-center">
          <CheckCircle className="text-emerald-500 w-20 h-20" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 text-gray-800">
          Thanh toán thành công
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi 💙
        </p>

        {/* Info */}
        <div className="mt-6 space-y-3 text-sm md:text-base">
          <div className="flex justify-center">
            <QRCode value={`ORDER-${paymentData.id}`} size={80} />
          </div>

          <InfoRow label="Mã đơn hàng" value={`#${paymentData.id}`} />
          <InfoRow
            label="Tên phim"
            value={paymentData?.showtime?.movie?.title}
          />
          <InfoRow
            label="Tên Rạp - Phòng"
            value={
              paymentData?.showtime?.room?.movietheater?.name +
              " - " +
              paymentData?.showtime?.room?.name
            }
          />
          <InfoRow label="Số ghế" value={seatName + " "} />
          <InfoRow
            label="Combo bắp nước"
            value={paymentData?.orderCombos
              ?.map((item) => item.combo.description)
              .join(", ")}
          />
          <InfoRow
            label="Giờ chiếu"
            value={dayjs(paymentData?.showtime?.startTime).format("HH:mm")}
          />
          <InfoRow label="Khách hàng" value={name} />
          <InfoRow
            label="Trạng thái"
            value={
              <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold">
                Đã thanh toán
              </span>
            }
          />
          <InfoRow
            label="Tổng tiền"
            value={
              <span className="text-lg font-bold text-blue-600">
                {Number(paymentData.totalAmount).toLocaleString()} đ
              </span>
            }
          />
        </div>

        {/* Button */}
        <div className="mt-8">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            onClick={() => {
              navigate("/");
            }}
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

export default PaymentSuccess;
