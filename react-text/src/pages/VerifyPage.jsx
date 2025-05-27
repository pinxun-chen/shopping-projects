import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('驗證中...');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      fetch(`http://localhost:8082/users/verify?token=${token}`)
        .then(res => res.json())
        .then(result => {
          if (result.status === 200) {
            localStorage.setItem("verifyMessage", result.message); // 暫存訊息
            navigate('/login'); // 回登入頁
          } else {
            setStatus(result.message || '驗證失敗');
          }
        })
        .catch(() => setStatus('驗證失敗，請稍後再試'));
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', marginTop: '5rem', fontFamily: 'Arial' }}>
      <h2 style={{ color: status.includes('成功') ? 'green' : 'red' }}>{status}</h2>
    </div>
  );
}

export default VerifyPage;
