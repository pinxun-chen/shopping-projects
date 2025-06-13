import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetailPageUser() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedStock, setSelectedStock] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [editing, setEditing] = useState(false);
  const [replyMap, setReplyMap] = useState({});
  const [hasReviewed, setHasReviewed] = useState(false);

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

  const checkIfUserHasReviewed = (reviewsList) => {
    if (!currentUserId) return;
    const reviewed = reviewsList.some(r => r.userId === currentUserId);
    setHasReviewed(reviewed);
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/review/${id}`);
      const data = await res.json();
      if (data.status === 200) {
        setReviews(data.data);
        checkIfUserHasReviewed(data.data);
      } else {
        console.warn(data.message);
      }
    } catch (err) {
      console.error('取得評價失敗:', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/users/me', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === 200) {
        setCurrentUserId(data.data.userId);
        setCurrentUserRole(data.data.role);
      }
    } catch (err) {
      console.warn('無法取得使用者資訊', err);
    }
  };

  const handleReplyChange = (reviewId, text) => {
    setReplyMap((prev) => ({ ...prev, [reviewId]: text }));
  };

  const handleReplySubmit = async (reviewId) => {
    const reply = replyMap[reviewId];
    if (!reply) return;
    try {
      const res = await fetch(`/api/review/reply/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reply })
      });
      const data = await res.json();
      if (data.status === 200) {
        alert('回覆成功');
        setReplyMap((prev) => ({ ...prev, [reviewId]: '' }));
        fetchReviews();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('回覆失敗: ' + err.message);
    }
  };

  const handleReplyDelete = async (reviewId) => {
    if (!window.confirm('確定要刪除回覆嗎？')) return;
    try {
      const res = await fetch(`/api/review/reply/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.status === 200) {
        alert('回覆已刪除');
        fetchReviews();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('刪除失敗: ' + err.message);
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
    if (!rating) {
      alert('請選擇評分');
      return;
    }
    if (!editing && hasReviewed) {
      alert('您已評價過此商品');
      return;
    }

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
        alert(editing ? '更新成功！' : '感謝您的評價！');
        setComment('');
        setRating(0);
        setEditing(false);
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

  const handleDeleteReview = async () => {
    if (!window.confirm('確定要刪除這則評價嗎？')) return;
    try {
      const res = await fetch(`/api/review/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.status === 200) {
        alert('已刪除');
        setComment('');
        setRating(0);
        setEditing(false);
        fetchReviews();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('刪除失敗：' + err.message);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCurrentUser();
  }, [id]);

  useEffect(() => {
    if (currentUserId !== null) {
      fetchReviews();
    }
  }, [currentUserId]);

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
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
        <img src={product.imageUrl} alt={product.name} className="w-64 h-64 object-cover rounded shadow" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-lg mb-1">價格: <span className="font-semibold">${product.price}</span></p>
          <p className="text-gray-600 mb-1">分類: {product.categoryName}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="mb-4">
            <label className="block mb-1 font-medium">選擇尺寸：</label>
            <select
              className="border px-3 py-2 rounded"
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
      </div>

      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">商品評價</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">目前尚無評價</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={`${r.userId}-${r.createdAt}`} className="border p-4 rounded bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">
                  👤 {r.username} ‧ {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="text-yellow-500 font-medium">⭐️ {r.rating} 分</div>
                <div className="text-sm text-gray-700 mb-2">{r.comment}</div>
                {r.reply && (
                  <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded mb-2">
                    業者已回覆：{r.reply}
                  </div>
                )}
                {r.userId === currentUserId && (
                  <div className="mt-2 space-x-3 text-right">
                    <button
                      onClick={() => {
                        setRating(r.rating);
                        setComment(r.comment);
                        setEditing(true);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      編輯
                    </button>
                    <button
                      onClick={handleDeleteReview}
                      className="text-red-600 hover:underline text-sm"
                    >
                      刪除
                    </button>
                  </div>
                )}
                {currentUserRole === 'ADMIN' && (
                  <div className="mt-4">
                    <textarea
                      rows="2"
                      className="border w-full px-3 py-2 mb-2 rounded"
                      placeholder="輸入回覆內容"
                      value={replyMap[r.id] || ''}
                      onChange={(e) => handleReplyChange(r.id, e.target.value)}
                    />
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleReplySubmit(r.id)}
                      >
                        {r.reply ? '更新回覆' : '儲存回覆'}
                      </button>
                      {r.reply && (
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                          onClick={() => handleReplyDelete(r.id)}
                        >
                          刪除回覆
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPageUser;
