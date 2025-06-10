import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

function ProductSalesChart() {
  const [chartData, setChartData] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allData, setAllData] = useState([]); // 存原始資料
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/admin/report/product-sales', { credentials: 'include' })
      .then(res => res.json())
      .then(json => {
        if (json.status === 200) {
          const rawData = json.data;
          setAllData(rawData); // 儲存原始資料
          updateChart(rawData);
        } else {
          alert(json.message);
        }
      });
  }, []);

  const updateChart = (data) => {
    // 建立尺寸清單（不重複）
    const allSizes = [...new Set(data.map(d => d.size))];

    // 分組處理
    const grouped = {};
    data.forEach(item => {
      if (!grouped[item.productName]) {
        grouped[item.productName] = { productName: item.productName };
      }
      grouped[item.productName][item.size] = item.totalSold;
    });

    const formatted = Object.values(grouped);
    setChartData(formatted);
    setSizes(allSizes);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    const filtered = allData.filter(item =>
      `${item.productId} ${item.productName} ${item.name} ${item.size} `.toLowerCase().includes(keyword.toLowerCase())
    );
    updateChart(filtered);
  };

  return (
    <div className="p-4">

        <h2 className="text-xl font-bold mb-4">商品銷售圖表</h2>

        {/* 搜尋欄位 */}
        <div className="mb-4">
            <input
            type="text"
            placeholder="搜尋"
            value={searchTerm}
            onChange={handleSearch}
            className="border px-3 py-2 rounded w-full max-w-sm"
            />
        </div>

        <div className="flex justify-end mb-2">
            <button
            onClick={() => navigate('/admin/report')}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            返回報表
            </button>
        </div>

        {/* 圖表 */}
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
                dataKey="productName"
                type="category"
                width={150}
                tick={{ fontSize: 16 }}
            />
            <Tooltip />
            <Legend />
            {sizes.map((size, index) => (
                <Bar
                key={size}
                dataKey={size}
                name={`尺寸 ${size}`}
                fill={`hsl(${index * 60}, 70%, 60%)`}
                />
            ))}
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}

export default ProductSalesChart;
