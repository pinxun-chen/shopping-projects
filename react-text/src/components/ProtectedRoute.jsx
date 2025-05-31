import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ loggedIn, children }) => {
  const location = useLocation();

  useEffect(() => {
    if (!loggedIn) {
      // 根據路徑設定不同的登入提示
      let message = "請先登入才能查看此頁面！";
      if (location.pathname.includes("/cart")) {
        message = "請先登入才能查看購物車！";
      } else if (location.pathname.includes("/orders")) {
        message = "請先登入才能查看歷史訂單！";
      } else if (location.pathname.includes("/profile")) {
        message = "請先登入才能查看會員資料！";
      }
      localStorage.setItem("verifyMessage", message);
    }
  }, [loggedIn, location.pathname]);

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
