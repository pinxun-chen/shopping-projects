import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const API_URL = `http://localhost:8082/api/cart`;

  // 讀取購物車資料
  const fetchCart = async () => {
    try {
      // 從後端取得 userId
      const userRes = await fetch('http://localhost:8082/api/users/me', {
        credentials: 'include',
      });
      const userResult = await userRes.json();

      if (userResult.status !== 200 || !userResult.data?.userId) {
        console.warn('尚未登入，無法載入購物車');
        return;
      }

      const uid = userResult.data.userId;

      const res = await fetch(`${API_URL}/${uid}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await res.json();
      setCartItems(result.data || []);
    } catch (err) {
      console.error('購物車載入失敗:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 更新購物車數量
  const updateQuantity = async (cartItemId, quantity) => {
    await fetch(`${API_URL}/${cartItemId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
  };

  // 刪除項目
  const deleteItem = async (cartItemId) => {
    await fetch(`${API_URL}/${cartItemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchCart();
  };

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4"> 購物車</h2>
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="bg-white border rounded-lg shadow-md p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between transition hover:shadow-lg w-full max-w-2xl mx-auto"
        >
          <img
            src={
              item.imageUrl?.startsWith('http')
                ? item.imageUrl
                : `http://localhost:8082${item.imageUrl || '/assets/no-image.png'}`
            }
            alt={item.productName}
            className="w-32 h-32 object-cover rounded"
          />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            <div className="grid grid-cols-2 gap-y-1 text-sm sm:text-base text-right ml-auto">
              <span className="font-semibold">商品名稱：</span>
              <span>{item.productName}</span>

              <span className="font-semibold">尺寸：</span>
              <span>{item.size || '無'}</span>

              <span className="font-semibold">單價：</span>
              <span>${item.unitPrice}</span>

              <span className="font-semibold">數量：</span>
              <span className="flex justify-end gap-1">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
              </span>

              <span className="font-semibold">小計：</span>
              <span>${item.subtotal}</span>
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-500 hover:text-red-700 font-semibold mt-2 sm:mt-0"
            >
              ❌ 刪除
            </button>
          </div>
        </div>
      ))}
      <div className="mt-4 font-bold text-lg">
        總金額：${total}
        {total < 2000 ? (
          <p className="text-sm text-gray-600 mt-1">
            (滿2000免運)再消費 NT$ {2000 - total} 可享免運優惠
          </p>
        ) : (
          <p className="text-sm text-green-600 mt-1">已達免運標準</p>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="mt-6 text-right">
          <button
            onClick={handleCheckoutClick}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            前往結帳
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
