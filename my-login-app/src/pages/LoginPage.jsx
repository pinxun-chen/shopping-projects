import React, { useState, useEffect } from 'react';
import { login } from '../api/userApi';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const msg = localStorage.getItem("verifyMessage");
    if (msg) {
      setMessage(msg);
      localStorage.removeItem("verifyMessage");
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(form.username, form.password);
    if (!result.success) {
      setError(result.message);
    } else {
      alert('登入成功');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#007bff' }}>會員登入</h2>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label style={{ fontWeight: 'bold' }}>使用者名稱</label><br />
        <input name="username" onChange={handleChange} placeholder="帳號" required style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} /><br />
        <label style={{ fontWeight: 'bold' }}>密碼</label><br />
        <input name="password" type="password" onChange={handleChange} placeholder="密碼" required style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} /><br />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          登入
        </button>
      </form>
    </div>
  );
}

export default LoginPage;