const API_BASE = 'http://localhost:8082/users';

export const login = async (username, password) => {
  const res = await fetch('http://localhost:8082/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
    credentials: 'include'
  });
  return await res.json();
};

export const register = async (username, password, email) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  });
  return await res.json();
};

export const forgotPassword = async (username, email) => {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, email }),
  });
  return await res.json();
};

export const resetPassword = async (token, newPassword) => {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token, newPassword }),
  });
  return await res.json();
};

export const changePassword = async (username, oldPassword, newPassword) => {
  const res = await fetch(`${API_BASE}/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, oldPassword, newPassword }),
  });
  return await res.json();
};

export const getUserByUsername = async (username) => {
  const res = await fetch(`${API_BASE}/name/${username}`);
  return await res.json();
};


export const logout = async () => {
  const res = await fetch('http://localhost:8082/users/logout', {
    method: 'GET',
    credentials: 'include'
  });
  return await res.json();
};

export const checkLogin = async () => {
  const res = await fetch('http://localhost:8082/users/check-login', {
    method: 'GET',
    credentials: 'include'
  });
  return await res.json();
};

export const resendVerification = async (username) => {
  const res = await fetch('http://localhost:8082/users/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username })
  });
  return await res.json();
};