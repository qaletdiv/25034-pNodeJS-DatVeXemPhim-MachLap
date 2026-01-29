import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { createOrder } from "../../redux/Slices/orderSlice";
import { axiosClient } from "../../api/axiosClient";

export default function Checkout() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState("");
  const [couponData, setCouponData] = useState(null);

  // Tổng tiền
  const [finalTotal, setFinalTotal] = useState(checkoutData?.totalPrice || 0);

  /* ===== COMBO ===== */
  const [combos, setCombos] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);

  /* ===== VOUCHER COUPON===== */
  const [coupons, setCoupons] = useState([]);
  const [selectCoupon, setSelectCoupon] = useState("");

  /* ===== COUNTDOWN ===== */
  useEffect(() => {
    if (!checkoutData) navigate("/");

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

    fetchCombos();
    fetchCoupons();
    return () => clearInterval(timer);
  }, []);

  const fetchCombos = async () => {
    const res = await axiosClient.get("/api/combos");
    setCombos(res.data);
  };

  const fetchCoupons = async () => {
    const res = await axiosClient.get("/api/coupons");
    setCoupons(res.data);
  };

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

  /* ===== COMBO LOGIC ===== */
  const updateCombo = (combo, type) => {
    setSelectedCombos((prev) => {
      const found = prev.find((c) => c.id === combo.id);

      if (!found && type === "plus") {
        return [...prev, { ...combo, qty: 1 }];
      }

      if (found) {
        return prev
          .map((c) =>
            c.id === combo.id
              ? {
                  ...c,
                  qty: type === "plus" ? c.qty + 1 : c.qty - 1,
                }
              : c,
          )
          .filter((c) => c.qty > 0);
      }

      return prev;
    });
  };

  const comboTotal = selectedCombos.reduce(
    (sum, c) => sum + c.price * c.qty,
    0,
  );

  useEffect(() => {
    setFinalTotal(checkoutData?.totalPrice + comboTotal);
  }, [comboTotal]);

  // const coupon = coupons.find((item) => item.codeName === selectCoupon);

  // const finalTotal = checkoutData?.totalPrice + comboTotal;
  // let finalTotal = checkoutData?.totalPrice + comboTotal;
  // if (coupon) {
  // } else {
  //   finalTotal = checkoutData?.totalPrice + comboTotal;
  // }

  /* ===== API ===== */
  const createOrderApi = async () => {
    const res = await axiosClient.post(
      "/api/orders",
      {
        showtimeId: checkoutData.showtimeId,
        seatIds: checkoutData.seatIds,
        combos: selectedCombos.map((c) => ({
          comboId: c.id,
          quantity: c.qty,
        })),
        coupon: selectCoupon,
      },
      { withCredentials: true },
    );

    return res.data.clientSecret;
  };

  const handleCoupon = () => {
    const today = dayjs().format("YYYY-MM-DD");
    const coupon = coupons.find((item) => item.codeName === selectCoupon);

    if (!coupon) {
      toast.error("Mã này không tồn tại !!!");
      setSelectCoupon("");
      return;
    }

    if (today < coupon.startDate || today > coupon.endDate) {
      toast.error("Mã này đã hết hạn sử dụng !!!");
      setSelectCoupon("");
      return;
    }
    let total = checkoutData?.totalPrice + comboTotal;

    if (coupon.type === "percent") {
      total = total - (total * coupon.value) / 100;
      setCouponData(coupon.value + " %");
    }

    if (coupon.type === "fixed") {
      total = total - coupon?.value;
      setCouponData(coupon.value + " ₫");
    }

    if (total < 0) total = 0;

    setFinalTotal(total);
    toast.success("Áp dụng mã giảm giá thành công 🎉");
  };

  /* ===== SUBMIT ===== */
  const handlePayment = async () => {
    try {
      setLoading(true);

      let secret = clientSecret;
      if (!secret) {
        secret = await createOrderApi();
        setClientSecret(secret);
      }

      if (paymentMethod !== "stripe") {
        alert("Chưa tích hợp");
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        navigate("/processing");
      }
    } catch {
      toast.error("Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* INFO */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>

            <div className="space-y-2 text-sm">
              <p>
                🎬 <b>Phim:</b> {checkoutData.movieTitle}
              </p>
              <p>
                🕒 <b>Suất:</b> {checkoutData.showtime}
              </p>
              <p>
                💺 <b>Ghế:</b> {checkoutData.seats.join(", ")}
              </p>
            </div>
          </div>

          {/* COMBO */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <h3 className="font-semibold mb-4">🍿 Combo bắp nước</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {combos.map((c) => {
                const selected = selectedCombos.find((x) => x.id === c.id);

                return (
                  <div
                    key={c.id}
                    className="bg-[#111] rounded-lg p-4 flex gap-4"
                  >
                    <img
                      src={c.image}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold">{c.name}</h4>
                      <p className="text-xs text-gray-400">{c.description}</p>

                      <div className="flex justify-between items-center mt-3">
                        <span className="text-green-400 font-bold">
                          {parseFloat(c.price).toLocaleString()} ₫
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCombo(c, "minus")}
                            className="w-7 h-7 bg-red-500 rounded"
                          >
                            -
                          </button>

                          <span>{selected?.qty || 0}</span>

                          <button
                            onClick={() => updateCombo(c, "plus")}
                            className="w-7 h-7 bg-green-500 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <h3 className="font-semibold mb-3">Thanh toán</h3>

            <PaymentItem
              value="stripe"
              label="Thẻ quốc tế"
              current={paymentMethod}
              set={setPaymentMethod}
            />

            {paymentMethod === "stripe" && (
              <div className="mt-4 bg-white p-3 rounded text-black">
                <CardElement />
              </div>
            )}
            {error && <p className="text-red-500 mt-3">{error}</p>}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Tổng tiền</h3>

          <div className="space-y-2 text-sm">
            <p>🎟 Vé: {checkoutData.totalPrice.toLocaleString()} ₫</p>
            <p>🍿 Combo: {comboTotal.toLocaleString()} ₫</p>
            {couponData && <p>🏷️ Giảm: {couponData}</p>}
          </div>

          <p className="text-3xl font-bold text-green-400 mt-3">
            {finalTotal.toLocaleString()} ₫
          </p>

          {/* TIMER */}
          <div className="mt-6">
            <p className="text-gray-400 text-sm">Thời gian giữ ghế</p>
            <p className="text-xl font-bold text-red-500">
              {formatTime(timeLeft)}
            </p>
          </div>
          <div className="mt-6 mb-6 flex">
            <input
              className="px-2 py-3 rounded-lg text-black"
              placeholder="Nhập mã giảm giá"
              onChange={(e) => {
                setSelectCoupon(e.target.value);
              }}
              value={selectCoupon}
            ></input>
            <button
              className="ml-3 bg-red-600 text-white py-3 px-3 rounded-md font-semibold hover:opacity-55"
              onClick={handleCoupon}
            >
              Nhập mã
            </button>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 bg-red-600 py-3 rounded-lg font-semibold"
          >
            {loading ? "Đang xử lý..." : "Thanh toán"}
          </button>
          <button
            className="w-full mt-6 bg-slate-600 py-3 rounded-lg font-semibold hover:opacity-55"
            onClick={() => {
              navigate(-1);
            }}
          >
            Trở về trang đặt vé
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENT ===== */
function PaymentItem({ value, label, current, set }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer mb-2">
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
