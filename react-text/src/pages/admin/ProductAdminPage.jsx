import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductAdminPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { credentials: 'include' });
      const data = await res.json();
      if (data.status === 200) {
        setProducts(data.data);
      } else {
        alert(data.message || '查詢失敗');
      }
    } catch (err) {
      alert('取得商品失敗: ' + err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.categoryName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">商品管理</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜尋"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
      </div>
      <div className="flex justify-end mb-2">
        <button
          onClick={() => navigate('/admin/products/new')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          新增商品
        </button>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">圖片</th>
            <th className="border px-4 py-2">名稱</th>
            <th className="border px-4 py-2">分類</th>
            <th className="border px-4 py-2">價格</th>
            <th className="border px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover" />
              </td>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.categoryName}</td>
              <td className="border px-4 py-2">${p.price}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => navigate(`/admin/products/${p.id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  詳細資訊
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          返回後台管理
        </button>
      </div> */}
    </div>
  );
}

export default ProductAdminPage;