import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// 頁面元件
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import UserProfilePage from './pages/UserProfilePage';
import VerifyPage from './pages/VerifyPage';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';

const CategoryPage = () => <div className="p-4">商品分類</div>;
const CartPage = () => <div className="p-4">購物車</div>;

import { logout, checkLogin } from './api/userApi';

function ProtectedRoute({ loggedIn, children }) {
  const location = useLocation();
  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    alert('已登出');
  };

  useEffect(() => {
    checkLogin().then(res => {
      if (res.success && res.data === true) {
        setLoggedIn(true);
        localStorage.setItem("loggedIn", "true");
      }
    });
  }, []);

  return (
    <Router>
      {/* 導覽列 */}
      <nav className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
        <div className="text-xl font-bold">
          <Link to="/">Home</Link>
        </div>
        <div className="space-x-4">
          <Link to="/products" className="hover:underline">所有商品</Link>
          <Link to="/categories" className="hover:underline">商品分類</Link>
          <Link to="/categories" className="hover:underline">歷史訂單</Link>
        </div>
        <div className="space-x-2">
          {!loggedIn && (
            <>
              <Link to="/login" className="border px-2 py-1 rounded">登入會員</Link>
              <Link to="/cart" className="border px-2 py-1 rounded">購物車</Link>
            </>
          )}
          {loggedIn && (
            <>
              <button onClick={handleLogout} className="bg-gray-800 text-white px-3 py-1 rounded">登出</button>
              <Link to="/cart" className="border px-2 py-1 rounded">購物車</Link>
            </>
          )}
        </div>
      </nav>

      <div className="p-4">
        <Routes>
          {/* 首頁與登入頁面 */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              loggedIn
                ? <Navigate to="/" replace />
                : <LoginPage
                    onLogin={() => {
                      setLoggedIn(true);
                      localStorage.setItem('loggedIn', 'true');
                    }}
                    loggedIn={loggedIn}
                  />
            }
          />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          {/* 登入後受保護頁面 */}
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProtectedRoute loggedIn={loggedIn}><UserProfilePage /></ProtectedRoute>} />
          <Route path="/change" element={<ProtectedRoute loggedIn={loggedIn}><ChangePasswordPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
