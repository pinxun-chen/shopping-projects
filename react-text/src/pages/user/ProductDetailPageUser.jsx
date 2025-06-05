import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetailPageUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState('');

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.status === 200) {
        setProduct(data.data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('載入商品失敗: ' + err.message);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariantId) return alert('請選擇尺寸');

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product.id,
          variantId: Number(selectedVariantId),
          quantity: 1
        })
      });
      const data = await res.json();
      if (data.status === 200) {
        alert('已加入購物車');
        navigate('/cart');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('加入購物車失敗: ' + err.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-4">載入中...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <img src={product.imageUrl} alt={product.name} className="w-64 h-64 object-cover mx-auto" />
      <h2 className="text-2xl font-bold mt-4 text-center">{product.name}</h2>
      <p className="text-center">價格: ${product.price}</p>
      <p className="text-center">分類: {product.categoryName}</p>
      <p className="text-center mt-2">{product.description}</p>

      <div className="mt-4 text-center">
        <label className="block mb-1">選擇尺寸：</label>
        <select
          className="border px-2 py-1"
          value={selectedVariantId}
          onChange={(e) => setSelectedVariantId(e.target.value)}
        >
          <option value="">請選擇</option>
          {product.variants.map(v => (
            <option key={v.variantId} value={v.variantId}>
              {v.size}（剩餘 {v.stock}）
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          加入購物車
        </button>
      </div>
    </div>
  );
}

export default ProductDetailPageUser;
