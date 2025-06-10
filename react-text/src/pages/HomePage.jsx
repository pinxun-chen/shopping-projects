import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [hotProducts, setHotProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products/hot") // 熱銷商品 API
      .then((res) => res.json())
      .then((data) => setHotProducts(data.data || []));

    fetch("/api/products/latest") // 最新上架商品 API
      .then((res) => res.json())
      .then((data) => setLatestProducts(data.data || []));
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Banner */}
      <div className="w-full h-[300px] bg-cover bg-center bg-[url('/banner.jpg')] flex items-center justify-center">
        <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">歡迎來到我的商城</h1>
      </div>

      {/* 分類快速入口 */}
      <div className="w-full max-w-6xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {["男裝", "女裝", "配件", "特價"].map((category, idx) => (
          <div
            key={idx}
            className="bg-gray-100 hover:bg-gray-200 p-6 rounded-xl text-center shadow cursor-pointer"
            onClick={() => navigate(`/category/${category}`)}
          >
            <p className="text-xl font-semibold">{category}</p>
          </div>
        ))}
      </div>

      {/* 熱銷商品 */}
      <section className="w-full max-w-6xl px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">🔥 熱銷推薦</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hotProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 最新商品 */}
      <section className="w-full max-w-6xl px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">🆕 最新上架</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latestProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white text-center py-4 mt-10">
        <p>&copy; 2025 品勛商城 All rights reserved.</p>
      </footer>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow hover:shadow-md rounded-lg overflow-hidden cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold truncate">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </div>
    </div>
  );
};

export default HomePage;
