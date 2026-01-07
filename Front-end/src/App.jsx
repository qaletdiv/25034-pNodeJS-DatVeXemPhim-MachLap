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
function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={2000} />
        <Routes>
          <Route
            path="/seats/:showtimeId"
            element={
              <ProtectedRoute>
                <Seat />
              </ProtectedRoute>
            }
          ></Route>

          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/" element={<CommonPage />}>
            <Route path="home" element={<Home />}></Route>
            <Route path="movie/:id" element={<MovieDetail />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
