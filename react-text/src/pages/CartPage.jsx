import React, { useEffect, useState } from 'react';

const CartPage = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);

  const API_URL = `http://localhost:8082/api/cart`;

  // 讀取購物車資料
  const fetchCart = async () => {
    const uid = localStorage.getItem("userId"); 
    try {
      const res = await fetch(`${API_URL}/${uid}`,{
        method: 'GET',
        credentials: 'include' 
      });
      const result = await res.json();
      setCartItems(result.data || []);
    } catch (err) {
      console.error("購物車載入失敗:", err);
    }
  };

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) {
      setLoggedIn(false); // 控制頁面顯示提示訊息
      return;
    }
    setLoggedIn(true); // 安全保險
    fetchCart();
  }, []);

  if (!loggedIn) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold text-lg mb-4">🚫 請先登入才能查看購物車內容！</p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          前往登入
        </a>
      </div>
    );
  }

  // 更新購物車數量
  const updateQuantity = async (cartItemId, quantity) => {
    await fetch(`${API_URL}/${cartItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
  };

  // 刪除項目
  const deleteItem = async (cartItemId) => {
    await fetch(`${API_URL}/${cartItemId}`, { method: 'DELETE' });
    fetchCart();
  };
  
  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🛒 購物車</h2>
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="bg-white border rounded-lg shadow-md p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between transition hover:shadow-lg"
        >
          <img
            src={item.imageUrl || "/assets/no-image.png"}
            alt={item.productName}
            className="w-32 h-32 object-cover rounded"
          />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            <div className="text-sm sm:text-base">
              <p><span className="font-semibold">商品名稱：</span>{item.productName}</p>
              <p><span className="font-semibold">單價：</span>${item.unitPrice}</p>
              <p className="flex items-center gap-1">
                <span className="font-semibold">數量：</span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
              </p>
              <p><span className="font-semibold">小計：</span>${item.subtotal}</p>
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

      <div className="mt-4 font-bold text-lg">總金額：${total}</div>
    </div>
  );
};

export default CartPage;
