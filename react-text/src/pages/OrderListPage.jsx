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
        const sortedOrders = [...(result.data || [])].sort(
          (a, b) => new Date(b.orderTime) - new Date(a.orderTime)
        );
        setOrders(sortedOrders);
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
      <h2 className="text-xl font-bold mb-4">訂單列表</h2>

      {orders.length === 0 && (
        <p className="text-gray-500 text-center mt-10">目前尚無訂單紀錄。</p>
      )}

      {orders.map((order) => {
        const shippingFee = order.shippingFee ?? 0;
        const subtotal = order.totalAmount != null ? order.totalAmount - shippingFee : 0;

        return (
          <div
            key={order.orderId}
            className="border rounded-lg p-4 mb-6 shadow flex justify-between items-start gap-6"
          >
            <div className="flex-1">
              <p><strong>訂單編號：</strong>{order.orderId}</p>
              <p><strong>建立時間：</strong>{order.formattedTime}</p>
              <p><strong>付款方式：</strong>{order.paymentMethod || '未提供'}</p>
              <p><strong>收件人姓名：</strong>{order.receiverName || '未填寫'}</p>
              <p><strong>收件人電話：</strong>{order.receiverPhone || '未填寫'}</p>
              <p><strong>收件地址：</strong>{order.receiverAddress || '未填寫'}</p>
              <p><strong>Email：</strong>{order.email || '未填寫'}</p>

              <p className="mt-2">
                <strong>訂單狀態：</strong>
                <span
                  className={`font-bold px-2 py-1 rounded ${
                    order.status === '待出貨'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === '已出貨'
                      ? 'bg-yellow-100 text-yellow-700'
                      : order.status === '已完成'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {order.status || '未知狀態'}
                </span>
              </p>
              <p className="mt-2"><strong>商品小計：</strong>${subtotal}</p>
              <p><strong>運費：</strong>{shippingFee === 0 ? '免運費' : `$${shippingFee}`}</p>
              <p className="text-green-700 font-bold text-lg"><strong>總金額：</strong>${order.totalAmount}</p>
            </div>

            <div className="flex-1 flex flex-col justify-between items-end h-full">
              <div className="w-full text-right">
                <p className="font-semibold mb-2">商品明細：</p>
                {order.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex justify-end items-center mb-2 gap-2">
                    <img
                      src={
                        item.imageUrl?.startsWith('http')
                          ? item.imageUrl
                          : `http://localhost:8082${item.imageUrl || '/assets/no-image.png'}`
                      }
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <p>
                      {item.productName} Size：{item.size} × {item.quantity}（單價 ${item.price}）
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderListPage;
