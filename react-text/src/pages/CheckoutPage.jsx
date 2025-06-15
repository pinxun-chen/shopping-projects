import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [form, setForm] = useState({
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    paymentMethod: '',
    email: '',
    storeName: '',
    storeCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const navigate = useNavigate();
  const API_URL = 'http://localhost:8082/api/cart';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const uid = localStorage.getItem('userId');
    if (!uid) {
      console.warn('尚未登入，無法載入購物車');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/${uid}`, { credentials: 'include' });
      const result = await res.json();
      const items = result.data || [];
      setCartItems(items);

      const calculatedSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      setSubtotal(calculatedSubtotal);
      fetchShippingFee(calculatedSubtotal);
    } catch (err) {
      console.error('載入購物車失敗:', err);
      setError('載入購物車資料失敗');
    }
  };

  const fetchShippingFee = async (amount) => {
    try {
      const res = await fetch('http://localhost:8082/api/shipping/fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderAmount: amount }),
      });
      const result = await res.json();
      if (result.status === 200) {
        setShippingFee(result.data.shippingFee ?? 0);
        setFinalTotal(result.data.totalAmount ?? amount);
      } else {
        setError(result.message || '運費計算失敗');
      }
    } catch (err) {
      console.error('運費錯誤:', err);
      setError('運費計算 API 發生錯誤');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    const {
      receiverName, receiverPhone, receiverAddress,
      paymentMethod, email, storeName, storeCode,
      cardNumber, expiryDate, cvv,
    } = form;

    if (!receiverName || !receiverPhone || !receiverAddress || !paymentMethod || !email) {
      setError('請完整填寫所有必填欄位');
      return;
    }

    if (paymentMethod === '7-11 貨到付款' && (!storeName || !storeCode)) {
      setError('請填寫 7-11 門市資訊');
      return;
    }

    if (paymentMethod === '宅配信用卡付款' && (!cardNumber || !expiryDate || !cvv)) {
      setError('請填寫信用卡資訊');
      return;
    }

    if (finalTotal === 0 || subtotal === 0) {
      setError('尚未正確計算金額，請稍候再試');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        ...form,
        shippingFee: shippingFee ?? 0,
        totalAmount: finalTotal,
      };

      const res = await fetch('http://localhost:8082/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderPayload),
      });

      const result = await res.json();

      if (res.status === 200) {
        alert('訂單已建立，通知信已寄送至您的信箱');
        navigate('/orders');
      } else {
        alert('訂單建立失敗：' + result.message);
      }
    } catch (err) {
      console.error('發生錯誤:', err);
      alert('伺服器錯誤：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">收件資訊</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-gray-50 p-4 rounded border mb-4">
        <p className="font-semibold">商品小計：NT$ {subtotal}</p>
        <p className="font-semibold">運費：NT$ {shippingFee}</p>
        <p className="font-bold text-lg text-blue-700 mt-2">總金額：NT$ {finalTotal}</p>
      </div>

      <label className="block mb-1 font-semibold">收件人姓名</label>
      <input name="receiverName" value={form.receiverName} onChange={handleChange}
        className="w-full p-2 border rounded mb-4" placeholder="請輸入收件人姓名" required />

      <label className="block mb-1 font-semibold">收件人電話</label>
      <input name="receiverPhone" value={form.receiverPhone} onChange={handleChange}
        className="w-full p-2 border rounded mb-4" placeholder="請輸入電話" required />

      <label className="block mb-1 font-semibold">收件地址</label>
      <input name="receiverAddress" value={form.receiverAddress} onChange={handleChange}
        className="w-full p-2 border rounded mb-4" placeholder="請輸入收件地址" required />

      <label className="block mb-1 font-semibold">Email（將寄送訂單通知）</label>
      <input name="email" value={form.email} onChange={handleChange}
        className="w-full p-2 border rounded mb-4" type="email" placeholder="請輸入 Email" required />

      <label className="block mb-1 font-semibold">付款方式</label>
      <select
        name="paymentMethod"
        value={form.paymentMethod}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      >
        <option value="">請選擇付款方式</option>
        <option value="7-11 貨到付款">7-11 貨到付款</option>
        <option value="宅配貨到付款">宅配貨到付款</option>
        <option value="宅配信用卡付款">宅配信用卡付款</option>
      </select>

      {form.paymentMethod === '7-11 貨到付款' && (
        <>
          <label className="block mb-1 font-semibold">7-11 門市名稱</label>
          <input name="storeName" value={form.storeName} onChange={handleChange}
            className="w-full p-2 border rounded mb-4" placeholder="請輸入門市名稱" />

          <label className="block mb-1 font-semibold">門市代碼</label>
          <input name="storeCode" value={form.storeCode} onChange={handleChange}
            className="w-full p-2 border rounded mb-4" placeholder="請輸入門市代碼" />
        </>
      )}

      {form.paymentMethod === '宅配信用卡付款' && (
        <>
          <label className="block mb-1 font-semibold">信用卡卡號</label>
          <input name="cardNumber" value={form.cardNumber} onChange={handleChange}
            className="w-full p-2 border rounded mb-4" placeholder="例如：1234 5678 9012 3456" />

          <label className="block mb-1 font-semibold">有效期限（MM/YY）</label>
          <input name="expiryDate" value={form.expiryDate} onChange={handleChange}
            className="w-full p-2 border rounded mb-4" placeholder="例如：12/25" />

          <label className="block mb-1 font-semibold">安全碼（CVV）</label>
          <input name="cvv" value={form.cvv} onChange={handleChange}
            className="w-full p-2 border rounded mb-4" placeholder="3 位數字" />
        </>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? '結帳中...' : '確認結帳'}
        </button>

        <button
          onClick={() => navigate('/cart')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          返回購物車
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
