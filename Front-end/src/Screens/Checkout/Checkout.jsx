import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { createOrder } from "../../redux/Slices/orderSlice";
import { axiosClient } from "../../api/axiosClient";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minute
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState("");

  /* ===== CHECK DATA ===== */
  useEffect(() => {
    if (!checkoutData) navigate("/");
  }, []);

  /* ===== COUNTDOWN ===== */
  useEffect(() => {
    if (!checkoutData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [checkoutData]);

  const handleTimeout = () => {
    alert("Hết thời gian giữ ghế");
    localStorage.removeItem("checkoutData");
    navigate("/");
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* ===== TẠO ORDER + PAYMENT INTENT ===== */
  const createOrder = async () => {
    const res = await axiosClient.post(
      "/api/orders",
      {
        showtimeId: checkoutData.showtimeId,
        seatIds: checkoutData.seatIds,
      },
      { withCredentials: true }
    );

    return res.data.clientSecret;
  };

  /* ===== SUBMIT PAYMENT ===== */
  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1. Tạo order trước
      let secret = clientSecret;

      if (!secret) {
        secret = await createOrder();
        setClientSecret(secret);
      }

      // if (!clientSecret) {
      //   dispatch(
      //     createOrder({
      //       showtimeId: checkoutData.showtimeId,
      //       seatIds: checkoutData.seatIds,
      //     })
      //   );
      // }

      // 2. Nếu không phải stripe
      if (paymentMethod !== "stripe") {
        alert("Chưa tích hợp cổng này");
        return;
      }

      // 3. Stripe confirm
      const { error, paymentIntent } = await stripe.confirmCardPayment(secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        toast.info("Đang xác nhận thanh toán...", {
          autoClose: 1500,
        });

        navigate("/processing"); // trang loading
      }
    } catch (err) {
      toast.error("Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* ===== LEFT ===== */}
        <div className="md:col-span-2 bg-[#1a1a1a] p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>

          <div className="space-y-2 text-sm">
            <p>
              🎬 <b>Phim:</b> {checkoutData.movieTitle}
            </p>
            <p>
              🕒 <b>Suất chiếu:</b> {checkoutData.showtime}
            </p>
            <p>
              💺 <b>Ghế:</b> {checkoutData.seats.join(", ")}
            </p>
          </div>

          {/* ===== PAYMENT METHOD ===== */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Phương thức thanh toán</h3>

            <div className="space-y-3">
              <PaymentItem
                value="stripe"
                label="Thẻ quốc tế (Stripe)"
                current={paymentMethod}
                set={setPaymentMethod}
              />
              <PaymentItem
                value="vnpay"
                label="VNPay"
                current={paymentMethod}
                set={setPaymentMethod}
              />
              <PaymentItem
                value="momo"
                label="Ví MoMo"
                current={paymentMethod}
                set={setPaymentMethod}
              />
            </div>
          </div>

          {/* ===== CARD INPUT ===== */}
          {paymentMethod === "stripe" && (
            <div className="mt-6 bg-white p-4 rounded text-black">
              <CardElement />
            </div>
          )}

          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>

        {/* ===== RIGHT ===== */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl">
          <h3 className="font-semibold mb-3">Tổng thanh toán</h3>

          <p className="text-3xl font-bold text-green-400">
            {checkoutData.totalPrice.toLocaleString()} ₫
          </p>

          {/* TIMER */}
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Thời gian giữ ghế</p>
            <p className="text-xl font-bold text-red-500">
              {formatTime(timeLeft)}
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 bg-red-600 py-3 rounded-lg font-semibold
              hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENT ===== */
function PaymentItem({ value, label, current, set }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        value={value}
        checked={current === value}
        onChange={(e) => set(e.target.value)}
      />
      <span>{label}</span>
    </label>
  );
}
