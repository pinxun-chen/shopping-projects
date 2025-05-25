import React, { useState } from 'react';
import { forgotPassword } from '../api/userApi';

function ForgotPasswordPage() {
  const [form, setForm] = useState({ username: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await forgotPassword(form.username, form.email);
      if (res.status === 200) {
        setMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('發送失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#007bff' }}>忘記密碼</h2>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label style={{ fontWeight: 'bold' }}>使用者名稱</label><br />
        <input name="username" onChange={handleChange} placeholder="帳號" required style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} /><br />
        <label style={{ fontWeight: 'bold' }}>電子信箱</label><br />
        <input name="email" type="email" onChange={handleChange} placeholder="Email" required style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} /><br />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          {loading ? '發送中...' : '寄送重設密碼連結'}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;