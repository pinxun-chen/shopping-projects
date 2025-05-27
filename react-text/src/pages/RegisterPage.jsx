import React, { useState } from 'react';
import { register, resendVerification } from '../api/userApi';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    setShowResend(false);
    setLoading(true); // ← 開始 loading

    try {
      const result = await register(form.username, form.password, form.email);

      if (result.status === 200) {
        setMessage(result.message);
        setShowResend(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('註冊失敗，請稍後再試');
    } finally {
      setLoading(false); // 不管成功失敗都會關閉 loading
    }
  };


  const handleResend = async () => {
    const result = await resendVerification(form.username);
    alert(result.message);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Arial' }}>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">帳號註冊</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ fontWeight: 'bold' }}>使用者名稱</label><br />
        <input name="username" onChange={handleChange} placeholder="帳號" required style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} /><br />
        <label style={{ fontWeight: 'bold' }}>密碼</label><br />
        <input name="password" type="password" onChange={handleChange} placeholder="密碼" required style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} /><br />
        <label style={{ fontWeight: 'bold' }}>電子信箱</label><br />
        <input name="email" type="email" onChange={handleChange} placeholder="Email" required style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} /><br />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          {loading ? '處理中...' : '註冊'}
        </button>
      </form>
      {showResend && (
          <button onClick={handleResend}>
            👉 沒收到？點此重新寄送驗證信
          </button>
      )}

      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      
    </div>
    
  );
}

export default RegisterPage;