import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ loggedIn, requiredRole, children }) => {
  const location = useLocation();

  useEffect(() => {
    if (!loggedIn) {
      let message = "請先登入才能查看此頁面！";
      if (location.pathname.includes("/cart")) {
        message = "請先登入才能查看購物車！";
      } else if (location.pathname.includes("/orders")) {
        message = "請先登入才能查看歷史訂單！";
      } else if (location.pathname.includes("/profile")) {
        message = "請先登入才能查看會員資料！";
      } else if (location.pathname.includes("/admin")) {
        message = "請先登入才能進入管理後台！";
      }
      sessionStorage.setItem("verifyMessage", message); 
    }
  }, [loggedIn, location.pathname]);

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 從 sessionStorage 取角色
  const role = sessionStorage.getItem("role");
  if (requiredRole && role !== requiredRole) {
    alert("您沒有權限進入此頁面！");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
