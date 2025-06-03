import React, { useEffect, useState } from 'react';

const UserAdminPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const data = await res.json();
      if (data.status === 200) {
        setUsers(data.data);
      } else {
        alert(data.message || "載入會員資料失敗");
      }
    } catch (err) {
      alert("錯誤：" + err.message);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    const confirmed = window.confirm(`確定將此用戶改為 ${newRole} 嗎？`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/role?role=${newRole}`, {
        method: "PUT",
        credentials: "include",
      });
      const result = await res.json();
      if (res.status === 200) {
        alert("角色已更新");
        fetchUsers();
      } else {
        alert(result.message || "角色更新失敗");
      }
    } catch (err) {
      alert("錯誤：" + err.message);
    }
  };

  const deleteUser = async (userId) => {
    const confirm = window.confirm("確定要刪除此帳號嗎？此操作不可復原！");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/admin/users/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (res.status === 200) {
        alert("帳號已刪除");
        fetchUsers();
      } else {
        alert(result.message || "刪除失敗");
      }
    } catch (err) {
      alert("錯誤：" + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">會員管理</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">帳號</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">角色</th>
            <th className="border px-4 py-2">啟用</th>
            <th className="border px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">{user.active ? "✅" : "❌"}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => toggleRole(user.userId, user.role)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  {user.role === "USER" ? "升為管理者" : "改為一般用戶"}
                </button>
                <button
                  onClick={() => deleteUser(user.username)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  刪除帳號
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAdminPage;

