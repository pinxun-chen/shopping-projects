import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderAdminPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', { credentials: 'include' });
      const data = await res.json();
      if (data.status === 200) {
        setOrders(data.data);
      } else {
        alert(data.message || '查詢失敗');
      }
    } catch (err) {
      alert('取得訂單失敗: ' + err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = (order) => {
    navigate(`/admin/orders/${order.orderId}`, { state: order });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">訂單管理</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">訂單 ID</th>
            <th className="border px-4 py-2">用戶 ID</th>
            <th className="border px-4 py-2">總金額</th>
            <th className="border px-4 py-2">下單時間</th>
            <th className="border px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.orderId}>
              <td className="border px-4 py-2">{o.orderId}</td>
              <td className="border px-4 py-2">{o.userId}</td>
              <td className="border px-4 py-2">{o.totalAmount}</td>
              <td className="border px-4 py-2">{o.formattedTime}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleView(o)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  查看訂單資訊
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderAdminPage;
