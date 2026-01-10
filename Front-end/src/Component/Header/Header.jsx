import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { setFilter } from "../../redux/Slices/filterSlice";
import LogoutButton from "../LogoutButton/LogoutButton";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = localStorage.getItem("currentUser");
  const accessToken = localStorage.getItem("accessToken");
  const title = useSelector((state) => state.filters.title);
  const [value, setValue] = useState(title);

  const handleSearch = (e) => {
    const text = e.target.value;
    setValue(text);

    dispatch(setFilter({ title: text }));
  };
  const user = JSON.parse(currentUser);

  return (
    <header className="bg-gray-900 text-white shadow-lg z-50 w-full fixed">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-500">
              🎬 TicketFilm
            </span>
          </a>
          {/* SEARCH */}
          <div className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full">
              <input
                value={value}
                onChange={handleSearch}
                type="text"
                placeholder="Tìm phim, diễn viên..."
                className="w-full rounded-full bg-gray-800 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
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
          {/* MENU */}
          <nav className="hidden lg:flex space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-red-500">
              Phim
            </a>
            <a href="#" className="hover:text-red-500">
              Rạp / Giá vé
            </a>
            <a href="#" className="hover:text-red-500">
              Tin tức
            </a>
            <a href="#" className="hover:text-red-500">
              Khuyến mãi
            </a>
          </nav>
          {/* USER AREA */}
          <div className="relative ml-4 group">
            {/* when have not login */}
            {!accessToken && (
              <>
                <div class="flex space-x-2">
                  <button
                    onClick={() => {
                      navigate("/login");
                    }}
                    class="px-4 py-2 text-sm rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                    }}
                    class="px-4 pb-1.5 text-sm rounded-full bg-red-500 hover:bg-red-600 transition"
                  >
                    Đăng ký
                  </button>
                </div>
              </>
            )}
            {/* when login */}
            {accessToken && (
              <>
                <button className="flex items-center space-x-2 focus:outline-none">
                  <img
                    src="https://i.pravatar.cc/40"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:block text-sm">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition z-50">
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Hồ sơ
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Vé của tôi
                  </a>
                  <hr />
                  <LogoutButton />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
