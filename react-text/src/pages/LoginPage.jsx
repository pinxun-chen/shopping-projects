import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../api/userApi';

function LoginPage({ onLogin, loggedIn  }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const msg = localStorage.getItem('verifyMessage');
      if (msg) {
        setMessage(msg);             // 設定訊息
        localStorage.removeItem('verifyMessage'); // 清除避免下次還顯示
      }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(form.username, form.password);

    if (result.status === 200) {
      const { userId, username, role } = result.data;

      // 儲存登入資料
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("loggedIn", "true");

      onLogin(); // 通知父層更新狀態

      // 依角色跳轉
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(result.message || '登入失敗');
    }
  };

  // 如果登入成功就立刻跳轉首頁
  if (loggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Arial' }}>
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
          style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} /><br />

        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          登入
        </button>

        <div className="flex justify-between text-sm">
          <Link to="/register" className="text-blue-500 hover:underline">註冊新帳號</Link>
          <Link to="/forgot" className="text-blue-500 hover:underline">忘記密碼？</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
