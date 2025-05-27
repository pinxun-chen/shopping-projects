import React, { useState } from 'react';
import { getUserByUsername } from '../api/userApi';

function UserProfilePage() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await getUserByUsername(username);
    if (result.success) {
      setUser(result.data);
      setError('');
    } else {
      setUser(null);
      setError(result.message);
    }
  };

  return (
    <div>
      <h2>查詢使用者資料</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="輸入帳號" required />
        <button type="submit">查詢</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <p>使用者ID: {user.userId}</p>
          <p>帳號: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>啟用狀態: {user.active ? '啟用' : '未啟用'}</p>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;