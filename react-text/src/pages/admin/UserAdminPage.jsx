import React, { useEffect, useState } from "react";
import { getMe } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const UserAdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const data = await res.json();
      if (data.status === 200) {
        setUsers(data.data);
      } else {
        alert(data.message || "載入使用者失敗");
      }
    } catch (err) {
      alert("錯誤：" + err.message);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await getMe(); // 改用 /users/me
      if (res.status === 200) {
        setCurrentUsername(res.data.username);
      } else {
        console.warn("尚未登入", res.message);
      }
    } catch (err) {
      console.error("取得目前登入使用者失敗", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    const confirmed = window.confirm(`確定要將此使用者設為 ${newRole} 嗎？`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/role?role=${newRole}`, {
        method: "PUT",
        credentials: "include",
      });
      const result = await res.json();
      if (res.status === 200) {
        alert("角色更新成功");
        fetchUsers();
      } else {
        alert(result.message || "更新失敗");
      }
    } catch (err) {
      alert("角色更新錯誤：" + err.message);
    }
  };

  const deleteUser = async (username) => {
    if (username === currentUsername) {
      alert(" 不能刪除自己帳號！");
      return;
    }

    const confirm = window.confirm(`確定要刪除使用者「${username}」？此操作不可恢復。`);
    if (!confirm) return;

    try {
      const res = await fetch(`/api/admin/users/delete/${username}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (res.status === 200) {
        alert("帳號已成功刪除");
        fetchUsers();
      } else {
        alert(result.message || "刪除失敗");
      }
    } catch (err) {
      alert("刪除錯誤：" + err.message);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.username} ${u.email} ${u.role}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">會員管理</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜尋"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">名稱</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">權限</th>
            <th className="border px-4 py-2">驗證</th>
            <th className="border px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.userId}>
              <td className="border px-4 py-2">{user.userId}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">{user.active ? "True" : "False"}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => toggleRole(user.userId, user.role)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  {user.role === "USER" ? "升為管理者" : "降為用戶"}
                </button>
                <button
                  onClick={() => deleteUser(user.username)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          返回後台管理
        </button>
      </div> */}
    </div>
  );
};

export default UserAdminPage;
