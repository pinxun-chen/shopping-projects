import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetailPageUser() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedStock, setSelectedStock] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

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

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/review/${id}`);
      const data = await res.json();
      if (data.status === 200) {
        setReviews(data.data);
      } else {
        console.warn(data.message);
      }
    } catch (err) {
      console.error('取得評價失敗:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariantId) return alert('請選擇尺寸');
    if (selectedStock <= 0) return alert('該尺寸已售完');

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
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('加入購物車失敗: ' + err.message);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment) return alert('請填寫評分與留言');
    setLoading(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: Number(id), rating, comment })
      });
      const data = await res.json();
      if (data.status === 200) {
        alert('感謝您的評價！');
        setComment('');
        setRating(5);
        fetchReviews();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('提交評價失敗: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (!selectedVariantId || !product) {
      setSelectedStock(0);
      return;
    }
    const variant = product.variants.find(v => v.variantId === Number(selectedVariantId));
    setSelectedStock(variant?.stock || 0);
  }, [selectedVariantId, product]);

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
            <option key={v.variantId} value={v.variantId} disabled={v.stock === 0}>
              {v.size}（{v.stock === 0 ? '售完' : `剩餘 ${v.stock}`}）
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariantId || selectedStock <= 0}
          className={`px-4 py-2 rounded text-white ${
            !selectedVariantId || selectedStock <= 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          加入購物車
        </button>
      </div>

      {/* 評價區 */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-bold mb-2">商品評價</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-500">目前尚無評價</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="border p-3 rounded bg-gray-50">
                <div>⭐️ {r.rating} 分</div>
                <div className="text-sm text-gray-700">{r.comment}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}

        {/* 評價表單 */}
        <div className="mt-6">
          <h4 className="font-semibold mb-2">我要評價</h4>
          <label className="block mb-1">評分（1~5 分）：</label>
          <select
            className="border px-2 py-1 mb-2"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map(score => (
              <option key={score} value={score}>{score} 分</option>
            ))}
          </select>

          <textarea
            rows="3"
            className="border w-full px-2 py-1 mb-2"
            placeholder="留下您的心得..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={handleSubmitReview}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? '提交中...' : '送出評價'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPageUser;
