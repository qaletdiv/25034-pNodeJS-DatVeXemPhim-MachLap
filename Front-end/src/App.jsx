import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Screens/Login/Login";
import Home from "./Screens/Home/Home";
import Register from "./Screens/Register/Register";
import CommonPage from "./Screens/CommonPage/CommonPage";
import MovieDetail from "./screens/MovieDetail/MovieDetail";
import Seat from "./screens/Seat/Seat";
import ProtectedRoute from "./component/ProtectedRouter/ProtectedRouter";
import Checkout from "./screens/Checkout/Checkout";
import Processing from "./screens/ProcessingPayment/Processing";
import ScrollToTop from "./component/ScrollToTop/ScrollToTop";
import PaymentSuccess from "./screens/PaymentSuccess/PaymentSuccess";
import MyTickets from "./screens/MyTicket/MyTicket";
import Admin from "./screens/Admin/Admin";
import NotFound from "./screens/NotFound/NotFound";
import ProtectedAdmin from "./component/ProtectedAdmin/ProtectedAdmin";
import DataAdmin from "./component/DataAdmin/DataAdmin";
import Showtime from "./screens/Showtime/Showtime";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={2000} />
        <ScrollToTop />
        <Routes>
          <Route
            path="/seats/:showtimeId"
            element={
              <ProtectedRoute>
                <Seat />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/admin"
            element={
              <ProtectedAdmin>
                <Admin />
              </ProtectedAdmin>
            }
          >
            <Route path="" element={<DataAdmin />}></Route>
            <Route path="showtime" element={<Showtime />}></Route>
          </Route>
          <Route path="/processing" element={<Processing />}></Route>
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/" element={<CommonPage />}>
            <Route path="home" element={<Home />}></Route>
            <Route path="movie/:id" element={<MovieDetail />}></Route>
            <Route
              path="my-ticket"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            ></Route>
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
