import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductFormPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category'); // 注意這裡路徑要與後端對應
      const data = await res.json();
      if (data.status === 200) {
        setCategories(data.data);
      } else {
        alert('取得分類失敗');
      }
    } catch (err) {
      alert('發生錯誤: ' + err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, description, price, imageUrl, categoryId } = form;
    if (!name || !description || !price || !imageUrl || !categoryId) {
      alert("請完整填寫所有欄位");
      return;
    }
    if (parseInt(price) < 0) {
      alert("價格不能為負數");
      return;
    }

    const payload = {
      name,
      description,
      price: parseInt(price),
      imageUrl,
      category: { id: parseInt(categoryId) } // 傳給後端 category.id
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.status === 200) {
        alert('新增成功');
        navigate('/admin/products');
      } else {
        alert(data.message || '新增失敗');
      }
    } catch (err) {
      alert('新增錯誤: ' + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">新增商品</h2>

        <label className="block mb-2">名稱</label>
        <input
            className="border w-full px-3 py-2 mb-4"
            name="name"
            value={form.name}
            onChange={handleChange}
        />

        <label className="block mb-2">描述</label>
        <textarea
            className="border w-full px-3 py-2 mb-4"
            name="description"
            value={form.description}
            onChange={handleChange}
        />

        <label className="block mb-2">價格</label>
        <input
            type="number"
            min="0"
            className="border w-full px-3 py-2 mb-4"
            name="price"
            value={form.price}
            onChange={handleChange}
        />

        <label className="block mb-2">圖片網址</label>
        <input
            className="border w-full px-3 py-2 mb-4"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
        />

        <label className="block mb-2">分類</label>
        <select
            className="border w-full px-3 py-2 mb-4"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
        >
            <option value="">請選擇分類</option>
            {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </select>

        <div className="flex justify-center gap-2 mt-4">
            <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                新增商品
            </button>

            <button
                onClick={() => navigate('/admin/products')}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
                返回商品列表
            </button>
        </div>
        
    </div>
  );
}

export default ProductFormPage;
