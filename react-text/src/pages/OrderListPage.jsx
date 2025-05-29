import React, { useEffect, useState } from 'react';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8082/api/order/${userId}`, {
        method: 'GET',
        credentials: 'include', // 傳送 session cookie
      });
      const result = await res.json();

      if (res.status === 200) {
        setOrders(result.data || []);
      } else {
        console.error('訂單載入失敗:', result.message);
      }
    } catch (err) {
      console.error('發生錯誤:', err);
    }
  };

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    if (!uid) {
      setLoggedIn(false);
      return;
    }
    fetchOrders(uid);
  }, []);

  // 尚未登入提示畫面
  if (!loggedIn) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold text-lg mb-4">🚫 請先登入才能查看訂單紀錄！</p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          前往登入
        </a>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📦 訂單列表</h2>

      {orders.length === 0 && (
        <p className="text-gray-500 text-center mt-10">目前尚無訂單紀錄。</p>
      )}

      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 mb-4 shadow-md">
          <p><strong>訂單編號：</strong>{order.id}</p>
          <p><strong>總金額：</strong>${order.totalAmount}</p>
          <p><strong>建立時間：</strong>{order.createdTime}</p>
          {/* 可擴充顯示訂單項目 */}
        </div>
      ))}
    </div>
  );
};

export default OrderListPage;
