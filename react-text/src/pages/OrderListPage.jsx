import React, { useEffect, useState } from 'react';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);

  // 時間格式化函式
  const formatDateTime = (isoString) => {
    if (!isoString) return '未知時間';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return '無法解析';
    }
  };

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8082/api/order/${userId}`, {
        method: 'GET',
        credentials: 'include',
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

  if (!loggedIn) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold text-lg mb-4">請先登入才能查看訂單紀錄！</p>
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
      <h2 className="text-xl font-bold mb-4"> 訂單列表</h2>

      {orders.length === 0 && (
        <p className="text-gray-500 text-center mt-10">目前尚無訂單紀錄。</p>
      )}

      {orders.map((order) => (
        <div key={order.orderId} className="border rounded-lg p-4 mb-6 shadow">
          <p className="font-semibold">訂單編號：{order.orderId}</p>
          <p>總金額：${order.totalAmount}</p>
          <p>建立時間：{formatDateTime(order.orderTime)}</p>
          <p>付款方式：{order.paymentMethod || '未提供'}</p>
          <p>收件人姓名：{order.receiverName || '未填寫'}</p>
          <p>收件人電話：{order.receiverPhone || '未填寫'}</p>
          <p>收件地址：{order.receiverAddress || '未填寫'}</p>

          {Array.isArray(order.items) && order.items.length > 0 && (
            <div className="mt-4 pl-4">
              <p className="font-semibold mb-2"> 商品明細：</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {order.items.map((item, idx) => (
                  <li key={`${order.orderId}-${item.productId}-${idx}`}>
                    {item.productName} × {item.quantity}（單價 ${item.price}）
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderListPage;
