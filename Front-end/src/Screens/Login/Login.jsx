import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

import {
  login,
  googleLogin,
  loginFacebook,
  resetError,
} from "../../redux/Slices/authSlice";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPass] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const error = useSelector((state) => state.auth.error);
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const to = location.state?.from?.pathname || "/admin";

  const validate = () => {
    const newErrors = {};

    if (!emailOrPhone.trim()) {
      newErrors.email = "Email/Phone không được để trống";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validate()) {
      const data = await dispatch(login({ emailOrPhone, password }));

      if (login.fulfilled.match(data)) {
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        const role = JSON.parse(localStorage.getItem("currentUser")).role;
        if (role === "admin") {
          navigate(to, { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    }
  };

  const handleFacebookResponse = async (response) => {
    if (response.authResponse) {
      const token = response.authResponse.accessToken;

      const res = await dispatch(loginFacebook(token));

      if (loginFacebook.fulfilled.match(res)) {
        toast.success("Đăng nhập Facebook thành công!", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
        const role = JSON.parse(localStorage.getItem("currentUser")).role;
        if (role === "admin") {
          navigate(to, { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } else {
      toast.error("Đăng nhập Facebook thất bại");
    }
  };

  const loginWithFacebook = () => {
    if (!window.FB) {
      toast.error("Facebook SDK chưa load");
      return;
    }

    window.FB.login(
      (response) => {
        handleFacebookResponse(response);
      },
      { scope: "public_profile" },
    );
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
            <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>
            <p className="text-lg opacity-90">
              Login to continue your journey with us
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            ĐĂNG NHẬP
          </h2>
          {/* <p className="text-gray-500 text-center mb-8">
                        Enter your account details
                    </p> */}

          <form onSubmit={handleLogin} className="space-y-5 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email / Số diện thoại
              </label>
              <input
                type="text"
                placeholder="you@example.com / your phone number"
                className="w-full px-4 py-3 border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                }}
                value={emailOrPhone}
              />
              <p style={{ color: "red" }}>{errors.email}</p>
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-indigo-600" />
                Nhớ tài khoản
              </label>
              <a href="#" className="text-indigo-600 hover:underline">
                Quên mật khẩu?
              </a>
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
              Đăng nhập
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const result = await dispatch(
                  googleLogin(credentialResponse.credential),
                );

                if (googleLogin.fulfilled.match(result)) {
                  toast.success("Đăng nhập Google thành công!", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "light",
                  });
                  const role = JSON.parse(
                    localStorage.getItem("currentUser"),
                  ).role;
                  if (role === "admin") {
                    navigate(to, { replace: true });
                  } else {
                    navigate(from, { replace: true });
                  }
                } else {
                  toast.error("Đăng nhập Google thất bại");
                }
              }}
              onError={() => {
                toast.error("Đăng nhập Google thất bại");
              }}
            />
            <button
              onClick={loginWithFacebook}
              className="border rounded-sm px-2 flex items-center justify-center text-xs ml-1 hover:bg-gray-50"
            >
              <img
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                className="w-5 mr-1"
              />
              Đăng nhập bằng Facebook
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Bạn chưa có tài khoản?
            <Link
              onClick={() => {
                dispatch(resetError());
              }}
              to={"/register"}
              className="text-indigo-600 font-medium hover:underline"
            >
              {" "}
              Đăng kí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
