import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole, children }) => {
  const location = useLocation();
  const [status, setStatus] = useState({ loading: true, authorized: false, role: null });

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('http://localhost:8082/api/users/me', {
          credentials: 'include',
        });
        const result = await res.json();

        if (result.status === 200 && result.data) {
          const userRole = result.data.role;
          if (!requiredRole || userRole === requiredRole) {
            setStatus({ loading: false, authorized: true, role: userRole });
          } else {
            alert('您沒有權限進入此頁面！');
            setStatus({ loading: false, authorized: false, role: userRole });
          }
        } else {
          handleUnauth();
        }
      } catch (err) {
        console.error('驗證失敗:', err);
        handleUnauth();
      }
    };

    const handleUnauth = () => {
      let message = '請先登入才能查看此頁面！';
      if (location.pathname.includes('/cart')) {
        message = '請先登入才能查看購物車！';
      } else if (location.pathname.includes('/orders')) {
        message = '請先登入才能查看歷史訂單！';
      } else if (location.pathname.includes('/profile')) {
        message = '請先登入才能查看會員資料！';
      } else if (location.pathname.includes('/admin')) {
        message = '請先登入才能進入管理後台！';
      }
      localStorage.setItem('verifyMessage', message); // 若你前面 LoginPage 用的是 localStorage
      setStatus({ loading: false, authorized: false, role: null });
    };

    checkLogin();
  }, [location.pathname, requiredRole]);

  if (status.loading) return <div className="p-4">驗證中...</div>;

  if (!status.authorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
