import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter'; // 新增的 router 元件
import './App.css';
import { checkLogin, logout } from './api/userApi';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    checkLogin()
      .then(res => {
        if (res.status === 200 && res.data) {
          const { loggedIn, role } = res.data;
          setLoggedIn(loggedIn);
          setRole(role || '');
        } else {
          setLoggedIn(false);
          setRole('');
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setRole('');
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    setRole('');
  };

  return (
    <Router>
      <AppRouter loggedIn={loggedIn} role={role} onLogout={handleLogout} />
    </Router>
  );
}

export default App;
