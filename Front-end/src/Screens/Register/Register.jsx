import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { register } from "../../redux/Slices/authSlice";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPass, setConfirmpass] = useState("");
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Họ tên không được để trống";
    }

    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    }

    if (phone.length < 10 || phone.length > 10) {
      newErrors.phone = "Số điện thoại phải là 10 số";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (password !== confirmPass) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("email", email);
    console.log("pass", password);

    if (validate()) {
      try {
        const data = await dispatch(
          register({ email, name, phone, password, confirmPass })
        );
        if (register.fulfilled.match(data)) {
          navigate("/login");
          toast.success("Đăng kí tài khoản thành công!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            theme: "light",
          });
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                        flex items-center justify-center px-4"
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden
                          flex flex-col md:flex-row"
      >
        {/* LEFT */}
        <div
          className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600
                            items-center justify-center p-10"
        >
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Hi Guy 👋</h1>
            <p className="text-lg opacity-90">
              Register to continue your journey with us
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            ĐĂNG KÍ
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-lg
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
              <p style={{ color: "red" }}>{errors.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên
              </label>
              <input
                type="text"
                placeholder="your name"
                className="w-full px-4 py-3 border rounded-lg
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
              <p style={{ color: "red" }}>{errors.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                placeholder="your phone number"
                className="w-full px-4 py-3 border rounded-lg
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                value={phone}
              />
              <p style={{ color: "red" }}>{errors.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  setPass(e.target.value);
                }}
                value={password}
              />
              <p style={{ color: "red" }}>{errors.password}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  setConfirmpass(e.target.value);
                }}
                value={confirmPass}
              />
              <p style={{ color: "red" }}>{errors.confirmPassword}</p>
            </div>

            {error && (
              <p className="text-center" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg
                                hover:bg-indigo-700 transition duration-300"
            >
              Đăng kí
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Bạn dã có tài khoản?
            <Link
              to={"/login"}
              className="text-indigo-600 font-medium hover:underline"
            >
              {" "}
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
