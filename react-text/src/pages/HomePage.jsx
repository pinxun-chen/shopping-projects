import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Banner with Illustration as Background */}
      <div className="relative w-full h-[600px] flex items-center justify-center bg-cover bg-center brightness-110" style={{ backgroundImage: "url('/images/hero-illustration.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none"></div>
        <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg z-10 relative">歡迎來到我的商城</h1>
      </div>

      {/* 分類快速入口 */}
      <div className="w-full max-w-6xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {['衣服', '褲子', '鞋子', '飾品'].map((category, idx) => (
          <div
            key={idx}
            className="bg-gray-100 hover:bg-gray-200 p-6 rounded-xl text-center shadow cursor-pointer"
            onClick={() => navigate(`/products?category=${category}`)}
          >
            <p className="text-xl font-semibold">{category}</p>
          </div>
        ))}
      </div>
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
