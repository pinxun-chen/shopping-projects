import React from 'react';
import {
  Routes, Route, Link, Navigate, useNavigate,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import UserProfilePage from './pages/UserProfilePage';
import VerifyPage from './pages/VerifyPage';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPageUser from './pages/user/ProductDetailPageUser';
import CartPage from './pages/CartPage';
import OrderListPage from './pages/OrderListPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductAdminPage from './pages/admin/ProductAdminPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import ProductDetailPage from './pages/admin/ProductDetailPage';
import OrderAdminPage from './pages/admin/OrderAdminPage';
import UserAdminPage from './pages/admin/UserAdminPage';
import OrderDetailPage from './pages/admin/OrderDetailPage';
import ProductReportPage from './pages/admin/ProductReportPage';
import ProductSalesChart from './pages/admin/ProductSalesChart';
import ChatBotPage from './pages/ai/ChatBotPage';

import ProtectedRoute from './components/ProtectedRoute';

function AppRouter({ loggedIn, role, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    alert('已登出');
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white border-b p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-y-2 gap-x-4 shadow-sm flex-wrap">
        <div className="text-xl font-bold">
          <Link to="/">Home</Link>
        </div>
        <div className="flex flex-wrap gap-x-4 justify-center md:justify-start">
          {!loggedIn ? (
            <Link to="/products" className="hover:underline">所有商品</Link>
          ) : (
            <>
              <Link to="/products" className="hover:underline">所有商品</Link>
              {role === 'USER' && <Link to="/orders" className="hover:underline">歷史訂單</Link>}
              {role === 'ADMIN' && (
                <>
                  <Link to="/admin/products" className="hover:underline">商品管理</Link>
                  <Link to="/admin/orders" className="hover:underline">訂單管理</Link>
                  <Link to="/admin/users" className="hover:underline">會員管理</Link>
                  <Link to="/admin/report" className="hover:underline">銷售報表</Link>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-x-2 justify-center md:justify-end">
          {!loggedIn ? (
            <>
              <Link to="/login" className="border px-2 py-1 rounded">登入會員</Link>
              <Link to="/cart" className="border px-2 py-1 rounded">購物車</Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className="bg-gray-800 text-white px-3 py-1 rounded">登出</button>
              {role === 'USER' && (
                <>
                  <Link to="/cart" className="border px-2 py-1 rounded">購物車</Link>
                  <Link to="/chat" className="border px-2 py-1 rounded">AI 客服</Link>
                </>
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
                onLogin={(serverRole) => {
                  // 登入後回傳狀態到 App
                  window.location.href = '/'; // 或使用 navigate('/')
                }}
              />
            )
          } />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          {/* USER */}
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPageUser />} />
          <Route path="/cart" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="USER"><CartPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="USER"><OrderListPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="USER"><UserProfilePage /></ProtectedRoute>} />
          <Route path="/change" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="USER"><ChangePasswordPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="USER"><CheckoutPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="USER"><ChatBotPage /></ProtectedRoute>} />

          {/* ADMIN */}
          <Route path="/admin/products" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN"><ProductAdminPage /></ProtectedRoute>} />
          <Route path="/admin/products/new" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN"><ProductFormPage /></ProtectedRoute>} />
          <Route path="/admin/products/:id" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN"><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN"><OrderAdminPage /></ProtectedRoute>} />
          <Route path="/admin/orders/:orderId" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN"><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN"><UserAdminPage /></ProtectedRoute>} />
          <Route path="/admin/report" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN"><ProductReportPage /></ProtectedRoute>} />
          <Route path="/admin/report-chart" element={<ProtectedRoute loggedIn={loggedIn} requiredRole="ADMIN"><ProductSalesChart /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default AppRouter;
