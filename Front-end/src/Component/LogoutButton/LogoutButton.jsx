import { useDispatch } from "react-redux";

import { logout } from "../../redux/Slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };
  return (
    <div>
      <button
        className="w-full px-4 py-2 text-red-500 hover:bg-gray-100 rounded-lg"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
