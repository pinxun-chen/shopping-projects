const API_BASE = 'http://localhost:8082/users';

// 工具方法：統一解析 JSON（避免 HTML 回傳時報錯）
const safeJson = async (res) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    const text = await res.text();
    throw new Error("非 JSON 回應: " + text.slice(0, 100));
  }
};

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
    credentials: 'include'
  });
  return await safeJson(res);
};

export const register = async (username, password, email) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  });
  return await safeJson(res);
};

export const forgotPassword = async (username, email) => {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, email }),
  });
  return await safeJson(res);
};

export const resetPassword = async (token, newPassword) => {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token, newPassword }),
  });
  return await safeJson(res);
};

export const changePassword = async (username, oldPassword, newPassword) => {
  const res = await fetch(`${API_BASE}/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, oldPassword, newPassword }),
  });
  return await safeJson(res);
};

export const getUserByUsername = async (username) => {
  const res = await fetch(`${API_BASE}/name/${username}`, {
    credentials: 'include'
  });
  return await safeJson(res);
};

export const getUserById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    credentials: 'include'
  });
  return await safeJson(res);
};

// 安全登出（若沒登入會顯示訊息）
export const logout = async () => {
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'GET',
    credentials: 'include'
  });
  return await safeJson(res);
};

// 檢查是否登入
export const checkLogin = async () => {
  const res = await fetch(`${API_BASE}/check-login`, {
    method: 'GET',
    credentials: 'include'
  });
  return await safeJson(res);
};

// 查詢目前登入的使用者資訊（推薦在 Admin、會員中心使用）
export const getMe = async () => {
  const res = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    credentials: 'include'
  });
  return await safeJson(res);
};

export const resendVerification = async (username) => {
  const res = await fetch(`${API_BASE}/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username }),
  });
  return await safeJson(res);
};
