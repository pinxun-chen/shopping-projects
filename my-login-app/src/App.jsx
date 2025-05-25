import React, { useEffect, useState } from 'react';
import'./App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import UserProfilePage from './pages/UserProfilePage';
import VerifyPage from './pages/VerifyPage';
import { logout, checkLogin } from './api/userApi';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    alert('已登出');
  };

  useEffect(() => {
    checkLogin().then(res => {
      if (res.success) setLoggedIn(res.data);
    });
  }, []);

  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <nav>
          <Link to="/">登入</Link> | <Link to="/register">註冊</Link> | 
          <Link to="/forgot">忘記密碼</Link> 
          {/* | <Link to="/reset">重設密碼</Link> | <Link to="/change">修改密碼</Link> | <Link to="/profile">會員查詢</Link> */}
          {loggedIn && <> | <button onClick={handleLogout}>登出</button></>}
        </nav>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="/change" element={<ChangePasswordPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/verify" element={<VerifyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;