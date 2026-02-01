import { Navigate, useLocation } from "react-router-dom";

const ProtectedAdmin = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  const location = useLocation();
  if (!accessToken) {
    return (
      <div>
        <Navigate to="/login" replace state={{ from: location }}></Navigate>
      </div>
    );
  }
  const role = JSON.parse(localStorage.getItem("currentUser")).role;
  if (role !== "admin") {
    return <Navigate to="*" replace></Navigate>;
  }

  return children;
};

export default ProtectedAdmin;
