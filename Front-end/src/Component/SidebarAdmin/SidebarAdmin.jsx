// components/Sidebar.jsx
import { FiHome, FiFilm, FiLogOut, FiMenu } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/Slices/authSlice";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div
      style={{ zIndex: "10000" }}
      className={`${
        open ? "w-64" : "w-16"
      } bg-white border-r h-screen fixed transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {open && (
          <h1
            className={`
            font-bold text-xl whitespace-nowrap
            transition-all duration-300
            ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}
          `}
          >
            🎬 ADMIN
          </h1>
        )}
        <FiMenu
          onClick={() => setOpen(!open)}
          className="cursor-pointer text-xl"
        />
      </div>

      <nav className="p-4 space-y-4">
        <Menu
          icon={<FiHome />}
          text="Dashboard"
          open={open}
          onClick={() => {
            navigate("/admin");
          }}
        />
        <Menu
          icon={<FiFilm />}
          text="Quản lý phim"
          open={open}
          onClick={() => {
            navigate("/admin/showtime");
          }}
        />
        <Menu
          icon={<FiLogOut />}
          text="Đăng xuất"
          open={open}
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
        />
      </nav>
    </div>
  );
}

function Menu({ icon, text, open, onClick }) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
      onClick={onClick}
    >
      {icon}
      {open && (
        <span
          className={`
          whitespace-nowrap
          transition-all duration-300
          ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}
        `}
        >
          {text}
        </span>
      )}
    </div>
  );
}
