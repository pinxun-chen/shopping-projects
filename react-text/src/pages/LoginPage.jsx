import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../api/userApi';

function LoginPage({ onLogin, loggedIn }) {
  const [form, setForm] = useState({ username: '', password: '', captcha: '' });
  const [captchaUrl, setCaptchaUrl] = useState('/api/captcha?ts=' + Date.now());
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const msg = localStorage.getItem('verifyMessage');
    if (msg) {
      setMessage(msg);
      localStorage.removeItem('verifyMessage');
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const refreshCaptcha = () => {
    setCaptchaUrl('/api/captcha?ts=' + Date.now());
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(form.username, form.password, form.captcha);

    if (result.status === 200) {
      const { userId, username, role } = result.data;

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("loggedIn", "true");

      onLogin();

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(result.message || '登入失敗');
      refreshCaptcha(); // 失敗後刷新驗證碼
    }
  };

  if (loggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '4rem auto',
      padding: '2rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Arial'
    }}>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">會員登入</h2>

      <form onSubmit={handleSubmit}>
        {message && <p className="text-green-600 font-semibold mb-2">{message}</p>}
        {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

        <label style={{ fontWeight: 'bold' }}>使用者名稱</label><br />
        <input
          name="username"
          onChange={handleChange}
          value={form.username}
          placeholder="帳號"
          required
          style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
        /><br />

        <label style={{ fontWeight: 'bold' }}>密碼</label><br />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={form.password}
          placeholder="密碼"
          required
          style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
        /><br />

        <label style={{ fontWeight: 'bold' }}>驗證碼</label><br />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            name="captcha"
            onChange={handleChange}
            value={form.captcha}
            placeholder="請輸入驗證碼"
            required
            style={{ flex: 1, padding: '8px' }}
          />
          <img
            src={captchaUrl}
            alt="驗證碼"
            onClick={refreshCaptcha}
            style={{ marginLeft: '10px', height: '40px', cursor: 'pointer' }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
          登入
        </button>

        <div className="flex justify-between text-sm mt-3">
          <Link to="/register" className="text-blue-500 hover:underline">註冊新帳號</Link>
          <Link to="/forgot" className="text-blue-500 hover:underline">忘記密碼？</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
