import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../api/userApi';

function LoginPage({ onLogin, loggedIn }) {
  const [form, setForm] = useState({ username: '', password: '', captcha: '' });
  const [captchaUrl, setCaptchaUrl] = useState('/api/captcha?ts=' + Date.now());
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const msg = sessionStorage.getItem('verifyMessage');
    if (msg) {
      setMessage(msg);
      sessionStorage.removeItem('verifyMessage');
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

      // ✅ 改用 sessionStorage 儲存登入資訊（不會跨分頁共用）
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("loggedIn", "true");

      onLogin();
      navigate(role === "ADMIN" ? "/admin" : "/");
    } else {
      setError(result.message || '登入失敗');
      refreshCaptcha();
    }
  };

  // ✅ 判斷是否已登入也應該使用 sessionStorage
  if (loggedIn || sessionStorage.getItem("loggedIn") === "true") {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      maxWidth: '420px',
      margin: '5rem auto',
      padding: '2.5rem',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#007bff'
      }}>
        會員登入
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

        <div>
          <label style={{ fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>使用者名稱</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="帳號"
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>密碼</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="密碼"
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', marginBottom: '6px', display: 'block' }}>驗證碼</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              name="captcha"
              value={form.captcha}
              onChange={handleChange}
              placeholder="驗證碼"
              required
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '6px'
              }}
            />
            <img
              src={captchaUrl}
              alt="驗證碼"
              style={{
                height: '40px',
                marginLeft: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <button
              type="button"
              onClick={refreshCaptcha}
              title="重新整理驗證碼"
              style={{
                marginLeft: '6px',
                backgroundColor: 'transparent',
                borderRadius: '4px',
                padding: '6px 8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >🔄</button>
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
          登入
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>註冊新帳號</Link>
          <Link to="/forgot" style={{ color: '#007bff', textDecoration: 'none' }}>忘記密碼？</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
