import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductListPage = () => {
  const navigate = useNavigate();
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="border rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition h-96"
          onClick={() => navigate(`/products/${product.id}`)}>
                <img
                    src={product.imageUrl || '/assets/no-image.png'}
                    alt={product.name}
                    className="h-48 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-1">價格: ${product.price}</p>
                <p className="text-sm mb-3">分類: {product.categoryName || '無'}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 不觸發整個卡片跳轉事件
                    navigate(`/products/${product.id}`);
                  }}
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
