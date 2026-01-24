import { Navigate } from "react-router-dom";

const ProtectedAdmin = ({ children }) => {
  const role = JSON.parse(localStorage.getItem("currentUser")).role;

  if (role !== "admin") {
    return <Navigate to="*" replace></Navigate>;
  }

  return children;
};

export default ProtectedAdmin;
