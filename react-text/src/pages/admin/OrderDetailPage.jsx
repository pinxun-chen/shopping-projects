import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div className="p-4">無訂單資料</div>;

  const handleCancel = async () => {
    const confirm = window.confirm("確定要刪除這筆訂單嗎？");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/admin/orders/${state.orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if (result.status === 200) {
        alert("訂單已成功刪除");
        navigate("/admin/orders");
      } else {
        alert(result.message || "刪除失敗");
      }
    } catch (err) {
      alert("刪除訂單失敗：" + err.message);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">訂單詳細資訊</h2>

      <div className="bg-white shadow rounded p-6 space-y-2">
        <p><strong>訂單編號：</strong>{state.orderId}</p>
        <p><strong>用戶 ID：</strong>{state.userId}</p>
        <p><strong>總金額：</strong>${state.totalAmount}</p>
        <p><strong>建立時間：</strong>{state.formattedTime}</p>
        <p><strong>付款方式：</strong>{state.paymentMethod}</p>
        <p><strong>收件人：</strong>{state.receiverName}</p>
        <p><strong>電話：</strong>{state.receiverPhone}</p>
        <p><strong>地址：</strong>{state.receiverAddress}</p>
        <p><strong>Email：</strong>{state.email}</p>
      </div>

      <div className="mt-6 bg-white shadow rounded p-6">
        <p className="font-semibold mb-3">商品明細：</p>
        {state.items?.map((item, idx) => (
          <div key={idx} className="flex items-center mb-3 gap-4">
            <img
              src={item.imageUrl || '/assets/no-image.png'}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded border"
            />
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-600">
                數量：{item.quantity}，單價：${item.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
        >
          返回訂單列表
        </button>

        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          刪除訂單
        </button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
