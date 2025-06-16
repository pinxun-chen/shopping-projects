import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderDetailPage = () => {
  const { state: order } = useLocation();
  const navigate = useNavigate();

  if (!order) return <div className="p-4">無訂單資料</div>;

  const handleCancel = async () => {
    const confirm = window.confirm("確定要刪除這筆訂單嗎？");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/admin/orders/${order.orderId}`, {
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

  // 商品小計
  const subtotal = order.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0;

  // 自動補上運費（如果沒有從 state 傳入）
  const shippingFee =
    typeof order.shippingFee === 'number'
      ? order.shippingFee
      : subtotal >= 2000
      ? 0
      : 80;

  const totalAmount = subtotal + shippingFee;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">訂單詳細資訊</h2>

      {/* 訂單基本資訊 */}
      <div className="bg-white shadow rounded p-6 space-y-2">
        <p><strong>訂單編號：</strong>{order.orderId}</p>
        <p><strong>用戶 ID：</strong>{order.userId}</p>
        <p><strong>建立時間：</strong>{order.formattedTime}</p>
        <p><strong>付款方式：</strong>{order.paymentMethod || '未提供'}</p>
        <p><strong>收件人：</strong>{order.receiverName || '未填寫'}</p>
        <p><strong>電話：</strong>{order.receiverPhone || '未填寫'}</p>
        <p><strong>地址：</strong>{order.receiverAddress || '未填寫'}</p>
        <p><strong>Email：</strong>{order.email || '未填寫'}</p>
        {order.status && (
          <p><strong>訂單狀態：</strong>{order.status}</p>
        )}
      </div>

      {/* 商品明細 */}
      <div className="mt-6 bg-white shadow rounded p-6">
        <p className="font-semibold mb-3">商品明細：</p>
        {order.items?.map((item, idx) => (
          <div key={`${item.productId}-${idx}`} className="flex items-center mb-3 gap-4">
            <img
              src={item.imageUrl || '/assets/no-image.png'}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded border"
            />
            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-600">
                Size: {item.size || '無尺寸'}｜數量：{item.quantity}｜單價：${item.price}｜小計：${item.price * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 金額區塊 */}
      <div className="mt-6 bg-white shadow rounded p-6 space-y-2 text-right">
        <p><strong>商品小計：</strong>${subtotal}</p>
        <p><strong>運費：</strong>{shippingFee > 0 ? `$${shippingFee}` : '免運費'}</p>
        <p className="text-xl font-bold text-red-600">
          <strong>訂單總金額：</strong>${totalAmount}
        </p>
      </div>

      {/* 操作按鈕 */}
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
