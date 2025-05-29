// src/pages/ProductListPage.jsx
import React, { useEffect, useState } from 'react';

const ProductListPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 取得分類資料
  useEffect(() => {
    fetch('/api/category')
      .then(res => res.json())
      .then(result => {
        if (result.status === 200) {
          setCategories(result.data);
        } else {
          console.error('分類取得失敗:', result.message);
        }
      })
      .catch(err => console.error('取得分類錯誤', err));
  }, []);

  // 取得商品資料
  useEffect(() => {
    const url = selectedCategoryId
      ? `/api/products/category/${selectedCategoryId}`
      : `/api/products`;

    fetch(url)
      .then(res => res.json())
      .then(result => {
        if (result.status === 200) {
          setProducts(result.data);
        } else {
          console.error('商品取得失敗:', result.message);
        }
      })
      .catch(err => console.error('取得商品錯誤', err));
  }, [selectedCategoryId]);

  // 加入購物車
  const handleAddToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("請先登入才能加入購物車");
      return;
    }

    try {
      const res = await fetch('http://localhost:8082/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          productId: productId,
          quantity: 1
        })
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
      } else {
        alert(`加入失敗: ${result.message}`);
      }
    } catch (err) {
      alert('發生錯誤: ' + err.message);
    }
  };

  // 搜尋關鍵字過濾
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">所有商品</h2>

      {/* 搜尋與分類 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="搜尋商品名稱..."
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
        />

        <select
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        >
          <option value="">全部分類</option>
          {Array.isArray(categories) && categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 商品列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="border rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition h-96">
                <img
                    src={product.imageUrl || '/assets/no-image.png'}
                    alt={product.name}
                    className="h-48 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-1">價格: ${product.price}</p>
                <p className="text-sm mb-3">分類: {product.categoryName || '無'}</p>
                <button
                    onClick={() => handleAddToCart(product.id)}
                    className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    加入購物車
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
