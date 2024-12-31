import React from "react";

function ListUsers({ users, folders, searchTerm, selectedUser, onUserClick, onSearchChange }) {
  const filteredUsers = users.filter(user => {
    // Loại bỏ người dùng có role bằng 0
    if (user.role === 0) {
      return false;
    }

    const folderName = folders[user.email]?.name?.toLowerCase() || "";
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folderName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="w-1/4 bg-gray-100 p-5 border-r border-gray-300 overflow-y-auto">
      <p className="pl-1">Tìm kiếm:</p>
      <input
        type="text"
        placeholder="Tên người dùng hoặc tên lớp"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-sm"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <ul className="space-y-2">
        {filteredUsers.map((user, index) => (
          <li
            key={index}
            className={`flex flex-col p-2 rounded-lg shadow-md cursor-pointer 
              ${selectedUser?.email === user.email 
                ? 'bg-blue-100 border border-blue-500' 
                : 'bg-white hover:bg-gray-200'}`}
            onClick={() => onUserClick(user)}
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {folders[user.email]?.name || "Không có thư mục"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListUsers;
