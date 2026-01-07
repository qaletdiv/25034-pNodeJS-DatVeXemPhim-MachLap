import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return (
      <div>
        <Navigate to="/login" replace></Navigate>
      </div>
    );
  }
  return children;
};

export default ProtectedRouter;
