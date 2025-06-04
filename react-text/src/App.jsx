import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
import CartPage from './pages/CartPage';
import OrderListPage from './pages/OrderListPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductAdminPage from './pages/admin/ProductAdminPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import ProductDetailPage from './pages/admin/ProductDetailPage';
import OrderAdminPage from './pages/admin/OrderAdminPage';
import UserAdminPage from './pages/admin/UserAdminPage';
import OrderDetailPage from './pages/admin/OrderDetailPage';

import ProtectedRoute from "./components/ProtectedRoute";
import { logout, checkLogin } from './api/userApi';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    setRole("");
    localStorage.clear();
    alert('已登出');
  };

  useEffect(() => {
    checkLogin().then(res => {
      if (res.success && res.data === true) {
        setLoggedIn(true);
        localStorage.setItem("loggedIn", "true");
        const storedRole = localStorage.getItem("role");
        if (storedRole) setRole(storedRole);
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
          {role === "USER" && <Link to="/orders" className="hover:underline">歷史訂單</Link>}
          {role === "ADMIN" && <Link to="/admin" className="hover:underline">後台管理</Link>}
        </div>
        <div className="space-x-2">
          {!loggedIn ? (
            <>
              <Link to="/login" className="border px-2 py-1 rounded">登入會員</Link>
              <Link to="/cart" className="border px-2 py-1 rounded">購物車</Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className="bg-gray-800 text-white px-3 py-1 rounded">登出</button>
              {role !== "ADMIN" && (
                <Link to="/cart" className="border px-2 py-1 rounded">購物車</Link>
              )}
            </>
          )}
        </div>
      </nav>

      <div className="p-4">
        <Routes>
          {/* 公開頁面 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            loggedIn ? <Navigate to="/" replace /> : (
              <LoginPage
                onLogin={() => {
                  setLoggedIn(true);
                  setRole(localStorage.getItem("role"));
                  localStorage.setItem('loggedIn', 'true');
                }}
                loggedIn={loggedIn}
              />
            )
          } />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          {/* 使用者專屬頁面（USER） */}
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/cart" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="USER">
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="USER">
              <OrderListPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="USER">
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/change" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="USER">
              <ChangePasswordPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="USER">
              <CheckoutPage />
            </ProtectedRoute>
          } />

          {/* 管理員專屬頁面（ADMIN） */}
          <Route path="/admin" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN">
              <ProductAdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/new" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN">
              <ProductFormPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/:id" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN">
              <ProductDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN">
              <OrderAdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders/:orderId" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN">
              <OrderDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN">
              <UserAdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
