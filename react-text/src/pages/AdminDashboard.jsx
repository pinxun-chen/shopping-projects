import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    if (role !== 'ADMIN') {
      alert("您沒有權限進入後台");
      navigate('/');
    } else {
      setAdminName(username);
    }
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">後台管理系統</h1>
      <p className="mb-4">歡迎，{adminName}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => navigate('/admin/products')} className="p-6 border rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">商品管理</h2>
          <p>新增、修改、刪除商品</p>
        </div>
        <div onClick={() => navigate('/admin/orders')} className="p-6 border rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">訂單管理</h2>
          <p>查看與處理訂單</p>
        </div>
        <div onClick={() => navigate('/admin/users')} className="p-6 border rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">會員管理</h2>
          <p>檢視會員與角色設定</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;