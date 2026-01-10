import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRouter = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();
  if (!accessToken) {
    return (
      <div>
        <Navigate to="/login" replace state={{ from: location }}></Navigate>
      </div>
    );
  }
  return children;
};

export default ProtectedRouter;
