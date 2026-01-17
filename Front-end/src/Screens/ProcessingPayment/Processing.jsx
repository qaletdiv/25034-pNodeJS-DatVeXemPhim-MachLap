import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../api/axiosClient";
import "./processing.css";
import { useDispatch } from "react-redux";
import { setConfirmPayment } from "../../redux/Slices/orderSlice";

const Processing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axiosClient.get("/api/orders/my-latest");

        if (res.data.status === "paid") {
          localStorage.removeItem("checkoutData");
          dispatch(setConfirmPayment(res.data));
          navigate("/success");
        }
      } catch (err) {
        console.log(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <span className="loader top-20">Đang xác thực thanh toán...</span>
    </>
  );
};

export default Processing;
