import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { login } from '../api/userApi';

function LoginPage({ onLogin, loggedIn  }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   const msg = localStorage.getItem("verifyMessage");
  //   if (msg) {
  //     setMessage(msg);
  //     localStorage.removeItem("verifyMessage");
  //   }
  // }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(form.username, form.password);

    if (result.status === 200) {
      onLogin(); // 會跳轉
    } else {
      setError(result.message || '登入失敗');
    }
  };
  // 如果登入成功就立刻跳轉首頁
  if (loggedIn) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">會員登入</h2>
        {message && <p className="text-green-600 font-semibold mb-2">{message}</p>}
        {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

        <label className="font-semibold">使用者名稱</label>
        <input
          name="username"
          onChange={handleChange}
          value={form.username}
          placeholder="帳號"
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <label className="font-semibold">密碼</label>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={form.password}
          placeholder="密碼"
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mb-3"
        >
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
