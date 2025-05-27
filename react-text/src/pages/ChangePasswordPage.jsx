import React, { useState } from 'react';
import { changePassword } from '../api/userApi';

function ChangePasswordPage() {
  const [form, setForm] = useState({ username: '', oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await changePassword(form.username, form.oldPassword, form.newPassword);
    setMessage(result.message);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">變更密碼</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="帳號" onChange={handleChange} required /><br />
        <input name="oldPassword" placeholder="舊密碼" onChange={handleChange} required /><br />
        <input name="newPassword" placeholder="新密碼" onChange={handleChange} required /><br />
        <button type="submit">變更密碼</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePasswordPage;