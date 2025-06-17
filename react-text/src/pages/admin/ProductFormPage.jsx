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
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [variants, setVariants] = useState([]);
  const [variantForm, setVariantForm] = useState({ size: '', stock: '' });
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category');
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

  const handleAddCategory = async () => {
    const nameToFind = newCategory.trim(); // 先記住分類名稱
    if (!nameToFind) return alert('請輸入分類名稱');
    
    try {
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: nameToFind })
      });
      const data = await res.json();
      if (data.status === 200) {
        alert('新增分類成功');

        // 先關閉輸入框
        setShowAddCategory(false);
        setNewCategory('');

        // 重新取得所有分類並選取剛剛新增的那筆
        const updatedRes = await fetch('/api/category');
        const updatedData = await updatedRes.json();
        if (updatedData.status === 200) {
          setCategories(updatedData.data);
          const added = updatedData.data.find(cat => cat.name === nameToFind);
          if (added) {
            setForm(prev => ({ ...prev, categoryId: added.id }));
          }
        }
      } else {
        alert(data.message || '新增分類失敗');
      }
    } catch (err) {
      alert('新增分類錯誤: ' + err.message);
    }
  };


  const handleDeleteCategory = async (name) => {
    const cleanName = name?.trim(); 

    if (!cleanName) {
      alert("分類名稱不可為空");
      return;
    }

    if (!window.confirm(`確定要刪除分類「${cleanName}」嗎？`)) return;

    try {
      const res = await fetch(`/api/category/name/${encodeURIComponent(cleanName)}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok && data.status === 200) {
        alert('刪除成功');
        fetchCategories();
      } else {
        alert(data.message || '刪除失敗');
      }
    } catch (err) {
      alert('刪除分類錯誤: ' + err.message);
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

    const selectedCategory = categories.find(c => c.id === parseInt(categoryId));
    if (!selectedCategory) {
      alert("找不到對應的分類名稱");
      return;
    }

    const payload = {
      name,
      description,
      price: parseInt(price),
      imageUrl,
      categoryName: selectedCategory.name,
      variants
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
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


  const handleAddVariant = () => {
    const { size, stock } = variantForm;
    if (!size || stock === '') return alert('請填寫尺寸與庫存');
    if (parseInt(stock) < 0) return alert('庫存不能為負數');
    if (variants.find(v => v.size === size)) return alert('該尺寸已存在');

    setVariants([...variants, { size, stock: parseInt(stock) }]);
    setVariantForm({ size: '', stock: '' });
  };

  const handleDeleteVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">新增商品</h2>

      <label className="block mb-2">名稱</label>
      <input className="border w-full px-3 py-2 mb-4" name="name" value={form.name} onChange={handleChange} />

      <label className="block mb-2">描述</label>
      <textarea className="border w-full px-3 py-2 mb-4" name="description" value={form.description} onChange={handleChange} />

      <label className="block mb-2">價格</label>
      <input type="number" min="0" className="border w-full px-3 py-2 mb-4" name="price" value={form.price} onChange={handleChange} />

      <label className="block mb-2">圖片網址</label>
      <input className="border w-full px-3 py-2 mb-4" name="imageUrl" value={form.imageUrl} onChange={handleChange} />

      <label className="block mb-2">分類</label>
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <select
            className="border w-full px-3 py-2"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">請選擇分類</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="text-blue-600 underline whitespace-nowrap"
          >
            新增分類
          </button>
        </div>

        {showAddCategory && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="輸入分類名稱"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border px-2 py-1 flex-1"
            />
            <button
              onClick={handleAddCategory}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              儲存
            </button>
            <button
              onClick={() => {
                setShowAddCategory(false);
                setNewCategory('');
              }}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              取消
            </button>
          </div>
        )}

        <div className="mt-2 grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex justify-between items-center border p-2 rounded">
              <span>{cat.name}</span>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleDeleteCategory(cat.name)} // ✅ 改傳 name
              >
                刪除分類
              </button>
            </div>
          ))}
        </div>
      </div>

      <h3 className="font-semibold mb-2">尺寸與庫存</h3>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          name="size"
          placeholder="尺寸"
          value={variantForm.size}
          onChange={(e) => setVariantForm(prev => ({ ...prev, size: e.target.value }))}
          className="border px-2 py-1 w-1/2"
        />
        <input
          type="number"
          name="stock"
          placeholder="庫存"
          min="0"
          value={variantForm.stock}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 0 || e.target.value === '') {
              setVariantForm(prev => ({ ...prev, stock: e.target.value }));
            }
          }}
          className="border px-2 py-1 w-1/2"
        />
        <button
          onClick={handleAddVariant}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          新增尺寸
        </button>
      </div>

      {variants.length > 0 && (
        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">尺寸</th>
              <th className="border px-2 py-1">庫存</th>
              <th className="border px-2 py-1">操作</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{v.size}</td>
                <td className="border px-2 py-1">{v.stock}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteVariant(index)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-center gap-2 mt-4">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          新增商品
        </button>
        <button onClick={() => navigate('/admin/products')} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
          返回商品列表
        </button>
      </div>
    </div>
  );
}

export default ProductFormPage;
