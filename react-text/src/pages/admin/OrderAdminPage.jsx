import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderAdminPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredOrders = orders.filter((o) =>
    `${o.orderId} ${o.userId} ${o.formattedTime} ${o.totalAmount}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">訂單管理</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="搜尋"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
      </div>

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
          {filteredOrders.map((o) => (
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
      {/* <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          返回後台管理
        </button>
      </div> */}
    </div>
  );
}

export default OrderAdminPage;
