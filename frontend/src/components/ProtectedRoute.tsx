import { useEffect, useRef } from "react";
import { message } from "antd";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const hasShownMessage = useRef(false);

  useEffect(() => {
    if (!token && !hasShownMessage.current) {
      hasShownMessage.current = true;
      message.error("Please log in to access this page");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}