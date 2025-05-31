import React, { useEffect, useState } from 'react';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);

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
        <p className="text-red-500 font-bold text-lg mb-4"> 請先登入才能查看訂單紀錄！</p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          前往登入
        </a>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '未知時間';
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">訂單列表</h2>

      {orders.length === 0 && (
        <p className="text-gray-500 text-center mt-10">目前尚無訂單紀錄。</p>
      )}

      {orders.map((order) => (
        <div key={order.orderId} className="border rounded-lg p-4 mb-6 shadow flex justify-between items-start gap-6">
          {/* 左側：基本訂單資訊 */}
          <div className="flex-1">
            <p><strong>訂單編號：</strong>{order.orderId}</p>
            <p><strong>總金額：</strong>${order.totalAmount}</p>
            <p><strong>建立時間：</strong>{formatDate(order.orderTime)}</p>
            <p><strong>付款方式：</strong>{order.paymentMethod || '未提供'}</p>
            <p><strong>收件人姓名：</strong>{order.receiverName || '未填寫'}</p>
            <p><strong>收件人電話：</strong>{order.receiverPhone || '未填寫'}</p>
            <p><strong>收件地址：</strong>{order.receiverAddress || '未填寫'}</p>
          </div>

          {/* 右側：商品明細 */}
          <div className="flex-1 text-right">
            <p className="font-semibold mb-2"> 商品明細：</p>
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex justify-end items-center mb-2 gap-2">
                <img
                  src={item.imageUrl || "/assets/no-image.png"}
                  alt={item.productName}
                  className="w-12 h-12 object-cover rounded"
                />
                <p>{item.productName} × {item.quantity}（單價 ${item.price}）</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderListPage;
