export const getProductSalesReport = async () => {
  const res = await fetch('/api/admin/report/product-sales', {
    method: 'GET',
    credentials: 'include'
  });
  return await res.json();
};