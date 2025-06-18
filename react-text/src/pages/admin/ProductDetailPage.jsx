import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variantForm, setVariantForm] = useState({ size: '', stock: '' });
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', imageUrl: '', categoryId: '' });
  const [editingVariants, setEditingVariants] = useState({});
  const [categories, setCategories] = useState([]);
  const [originalForm, setOriginalForm] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.status === 200) {
        setProduct(data.data);
        const formData = {
          name: data.data.name,
          description: data.data.description,
          price: data.data.price,
          imageUrl: data.data.imageUrl,
          categoryId: data.data.categoryId?.toString() || ''
        };
        setEditForm(formData);
        setOriginalForm(formData);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('查詢失敗: ' + err.message);
    }
  };

  const isProductFormChanged = originalForm && JSON.stringify(editForm) !== JSON.stringify(originalForm);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category');
      const data = await res.json();
      if (data.status === 200) {
        setCategories(data.data);
      } else {
        alert('分類載入失敗');
      }
    } catch (err) {
      alert('取得分類錯誤: ' + err.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8082/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === 200) {
        setEditForm((prev) => ({
          ...prev,
          imageUrl: data.imageUrl,
        }));
        alert("圖片上傳成功！");
      } else {
        alert("圖片上傳失敗：" + data.message);
      }
    } catch (err) {
      alert("上傳錯誤：" + err.message);
    }
  };

  const handleUpdateProduct = async () => {
    const payload = {
      ...product,
      ...editForm,
      category: { id: Number(editForm.categoryId) }
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === 200) {
        alert('商品更新成功');
        fetchProduct();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('商品更新失敗: ' + err.message);
    }
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm('確定要刪除這個商品嗎？')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.status === 200) {
        alert('商品已刪除');
        navigate('/admin/products');
      } else {
        alert('刪除失敗：' + data.message);
      }
    } catch (err) {
      alert('刪除失敗: ' + err.message);
    }
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariantForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVariant = async () => {
    const { size, stock } = variantForm;
    const existing = product.variants.find(v => v.size === size);

    if (!size || !stock) return alert("請填寫尺寸與庫存");

    if (existing) {
      const newStock = existing.stock + Number(stock);
      try {
        const res = await fetch(`/api/variants/${existing.variantId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ size, stock: newStock })
        });
        const data = await res.json();
        if (data.status === 200) {
          setVariantForm({ size: '', stock: '' });
          fetchProduct();
        } else alert(data.message);
      } catch (err) {
        alert('更新庫存失敗: ' + err.message);
      }
    } else {
      try {
        const res = await fetch(`/api/variants/product/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ size, stock })
        });
        const data = await res.json();
        if (data.status === 200) {
          setVariantForm({ size: '', stock: '' });
          fetchProduct();
        } else alert(data.message);
      } catch (err) {
        alert('新增失敗: ' + err.message);
      }
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('確定要刪除這個尺寸嗎？')) return;
    try {
      const res = await fetch(`/api/variants/${variantId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 200) fetchProduct();
      else alert(data.message);
    } catch (err) {
      alert('刪除失敗: ' + err.message);
    }
  };

  const handleVariantStockChange = (variantId, stock) => {
    setEditingVariants(prev => ({ ...prev, [variantId]: stock }));
  };

  const handleUpdateVariant = async (variantId) => {
    const stock = editingVariants[variantId];
    const variant = product.variants.find(v => v.variantId === variantId);
    if (!variant) return alert("找不到對應的尺寸");

    try {
      const res = await fetch(`/api/variants/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: variant.size, stock })
      });
      const data = await res.json();
      if (data.status === 200) fetchProduct();
      else alert(data.message);
    } catch (err) {
      alert('更新失敗: ' + err.message);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  if (!product) return <div className="p-4">載入中...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">商品詳細資訊</h2>

      <div className="mb-6 text-center">
        <img
          src={editForm.imageUrl?.startsWith('http') ? editForm.imageUrl : `http://localhost:8082${editForm.imageUrl}`}
          alt={editForm.name}
          className="w-32 h-32 object-cover mx-auto mb-2"
        />

        <div className="text-left space-y-2">

          <label className="block font-semibold">上傳新圖片：</label>
          <div className="flex items-center space-x-2">
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 min-w-[120px] text-center"
            >
              選擇圖片
            </label>
            <span className="text-sm text-gray-700">
              {editForm.imageUrl ? editForm.imageUrl.split('/').pop() : '未選擇檔案'}
            </span>
          </div>

          <label className="block font-semibold">名稱：</label>
          <input className="border px-2 py-1 w-full" name="name" value={editForm.name} onChange={handleEditChange} />

          <label className="block font-semibold">分類：</label>
          <select
            name="categoryId"
            value={editForm.categoryId}
            onChange={handleEditChange}
            className="border px-2 py-1 w-full"
          >
            <option value="">請選擇分類</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="block font-semibold">價格：</label>
          <input type="number" className="border px-2 py-1 w-full" name="price" value={editForm.price} onChange={handleEditChange} />

          <label className="block font-semibold">描述：</label>
          <textarea className="border px-2 py-1 w-full" name="description" value={editForm.description} onChange={handleEditChange} />
        </div>

        <button
          onClick={handleUpdateProduct}
          className={`mt-4 px-4 py-1 rounded text-white ${
            isProductFormChanged
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!isProductFormChanged}
        >
          儲存變更
        </button>
      </div>

      <h3 className="font-semibold mb-2">尺寸與庫存</h3>
      <table className="border w-full mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">尺寸</th>
            <th className="border px-2 py-1">庫存</th>
            <th className="border px-2 py-1">操作</th>
          </tr>
        </thead>
        <tbody>
          {product.variants.map(v => (
            <tr key={v.variantId}>
              <td className="border px-2 py-1">{v.size}</td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  min="0"
                  value={editingVariants[v.variantId] ?? v.stock}
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    if (value >= 0) {
                      handleVariantStockChange(v.variantId, value);
                    }
                  }}
                  className="border px-2 py-1 w-20 text-center"
                />
              </td>
              <td className="border px-2 py-1 space-x-1">
                <button
                  onClick={() => handleUpdateVariant(v.variantId)}
                  className={`px-2 py-1 rounded ${
                    editingVariants[v.variantId] != null && editingVariants[v.variantId] !== v.stock
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                  disabled={editingVariants[v.variantId] == null || editingVariants[v.variantId] === v.stock}
                >
                  儲存
                </button>
                <button
                  onClick={() => handleDeleteVariant(v.variantId)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">新增尺寸</h4>
        <input
          name="size"
          value={variantForm.size}
          onChange={handleVariantChange}
          placeholder="尺寸"
          className="border px-2 py-1 mr-2"
        />
        <input
          name="stock"
          value={variantForm.stock}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 0 || e.target.value === '') {
              handleVariantChange(e); // 只在合法時更新
            }
          }}
          placeholder="庫存"
          type="number"
          min="0"
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={handleAddVariant}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          新增
        </button>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          返回商品列表
        </button>
        <button
          onClick={handleDeleteProduct}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          刪除商品
        </button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
