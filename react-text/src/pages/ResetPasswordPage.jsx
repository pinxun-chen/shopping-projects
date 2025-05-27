import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/userApi';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await resetPassword(token, newPassword);
      if (res.status === 200) {
        setMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('重設失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Arial', textAlign: 'center' }}>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">重設密碼</h2>

      {message && (
        <>
          <p style={{ color: 'green', fontWeight: 'bold', margin: '1rem 0' }}>{message}</p>
          <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            返回登入
          </button>
        </>
      )}

      {!message && (
        <form onSubmit={handleSubmit}>
          <label style={{ fontWeight: 'bold' }}>新密碼</label><br />
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="請輸入新密碼" required style={{ width: '100%', padding: '8px', marginBottom: '1rem', marginTop: '0.5rem' }} /><br />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
            {loading ? '送出中...' : '確認重設密碼'}
          </button>
        </form>
      )}

      {error && <p style={{ color: 'red', fontWeight: 'bold', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export default ResetPasswordPage;