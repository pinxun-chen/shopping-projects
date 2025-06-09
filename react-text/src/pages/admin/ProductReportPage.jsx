import React, { useEffect, useState } from 'react';
import { getProductSalesReport } from '../../api/adminApi';

const ProductReportPage = () => {
  const [report, setReport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const res = await getProductSalesReport();
      if (res.status === 200) {
        setReport(res.data);
      } else {
        alert(res.message || '報表載入失敗');
      }
    };
    fetchReport();
  }, []);

  const filteredReport = report.filter((item) =>
    `${item.productId} ${item.productName} ${item.name} ${item.size} `.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">商品銷售報表</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="搜尋"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
      </div>

      <table className="min-w-full border text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">商品 ID</th>
            <th className="border px-4 py-2">商品名稱</th>
            <th className="border px-4 py-2">分類</th>
            <th className="border px-4 py-2">尺寸</th>
            <th className="border px-4 py-2">總銷售數量</th>
          </tr>
        </thead>
        <tbody>
          {filteredReport.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{item.productId}</td>
              <td className="border px-4 py-2">{item.productName}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.size}</td>
              <td className="border px-4 py-2">{item.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductReportPage;
