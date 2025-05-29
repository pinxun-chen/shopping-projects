import React, { useEffect, useState } from 'react';

const OrderListPage = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8082/api/order/${userId}`)
      .then((res) => res.json())
      .then((result) => setOrders(result.data || []));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📦 訂單紀錄</h2>
      {orders.map((order) => (
        <div key={order.orderId} className="border p-2 mb-4 rounded">
          <div>訂單時間：{order.orderTime}</div>
          <div>總金額：${order.totalAmount}</div>
          <div className="mt-2">明細：</div>
          <ul className="ml-4">
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.productName} x {item.quantity}（單價：${item.price}）
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderListPage;
