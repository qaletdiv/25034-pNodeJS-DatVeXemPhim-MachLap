import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { setFilter } from "../../redux/Slices/filterSlice";
import LogoutButton from "../LogoutButton/LogoutButton";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = localStorage.getItem("currentUser");
  const accessToken = localStorage.getItem("accessToken");
  const user = currentUser ? JSON.parse(currentUser) : null;

  const title = useSelector((state) => state.filters.title);
  const [value, setValue] = useState(title);
  const [openMobile, setOpenMobile] = useState(false);

  const handleSearch = (e) => {
    const text = e.target.value;
    setValue(text);
    dispatch(setFilter({ title: text }));
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg z-50 w-full fixed">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-red-500">
            🎬 TicketFilm
          </Link>

          {/* SEARCH DESKTOP */}
          <div className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full">
              <input
                value={value}
                onChange={handleSearch}
                type="text"
                placeholder="Tìm phim, diễn viên..."
                className="w-full rounded-full bg-gray-800 text-sm px-4 py-2
                           focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <svg
                className="w-5 h-5 absolute right-4 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>

          {/* MENU DESKTOP */}
          <nav className="hidden lg:flex space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-red-500">
              Phim
            </Link>
            <Link to="/my-ticket" className="hover:text-red-500">
              Vé của tôi
            </Link>
            <a href="#" className="hover:text-red-500">
              Khuyến mãi
            </a>
          </nav>

          {/* USER DESKTOP */}
          <div className="hidden md:flex ml-4 relative group">
            {!accessToken && (
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm rounded-full border
                             border-red-500 text-red-500
                             hover:bg-red-500 hover:text-white transition"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm rounded-full bg-red-500
                             hover:bg-red-600 transition"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {accessToken && (
              <>
                <button className="flex items-center space-x-2">
                  <img
                    src="https://i.pravatar.cc/40"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{user?.name}</span>
                </button>

                <div
                  className="absolute right-0 mt-2 w-44 bg-white text-gray-800
                                rounded-lg shadow-lg opacity-0
                                group-hover:opacity-100 transition z-50"
                >
                  <a className="block px-4 py-2 hover:bg-gray-100">Hồ sơ</a>
                  <a className="block px-4 py-2 hover:bg-gray-100">
                    Vé của tôi
                  </a>
                  <hr />
                  <LogoutButton />
                </div>
              </>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpenMobile(true)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {openMobile && (
        <div className="fixed inset-0 bg-black/60 z-50">
          <div
            className="absolute top-0 right-0 w-4/5 max-w-sm h-full
                          bg-gray-900 p-6 space-y-6"
          >
            {/* CLOSE */}
            <button
              className="text-2xl mb-4"
              onClick={() => setOpenMobile(false)}
            >
              ✕
            </button>

            {/* SEARCH MOBILE
            <input
              value={value}
              onChange={handleSearch}
              type="text"
              placeholder="Tìm phim..."
              className="w-full rounded-full bg-gray-800 px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-red-500"
            /> */}

            {/* MENU MOBILE */}
            <nav className="flex flex-col space-y-4 text-lg">
              <Link to="/" onClick={() => setOpenMobile(false)}>
                Phim
              </Link>
              <Link to="/my-ticket" onClick={() => setOpenMobile(false)}>
                Vé của tôi
              </Link>
              <a href="#">Khuyến mãi</a>
            </nav>

            <hr className="border-gray-700" />

            {/* USER MOBILE */}
            {!accessToken && (
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => navigate("/login")}
                  className="py-2 rounded-full border border-red-500
                             text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="py-2 rounded-full bg-red-500 hover:bg-red-600"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {accessToken && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://i.pravatar.cc/40"
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{user?.name}</span>
                </div>
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
