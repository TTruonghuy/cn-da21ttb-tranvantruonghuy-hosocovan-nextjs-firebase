import React from "react";
import Image from "next/image";
function ListUsers({ users, searchTerm, selectedUser, onUserClick, onSearchChange }) {
  // Lọc người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter(user =>
    user.role !== 0 &&
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[23%] bg-white p-5 border-r border-blue-300 overflow-y-auto">
      <p className="pl-1 text-xs font-bold mb-1">Tìm kiếm:</p>
      <input
        type="text"
        placeholder="Tên người dùng"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-sm "
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <p className="text-xs font-bold mb-2">Danh sách Cố vấn:</p>
      <ul className="space-y-2">
        {filteredUsers.map((user, index) => (
          <li
            key={index}
            className={`flex p-2 rounded-lg border-gray-300 cursor-pointer h-12
              ${selectedUser?.email === user.email
                ? 'bg-blue-100 border border-blue-500 hover:scale-105'
                : 'bg-white border hover:bg-gray-200 hover:scale-105'}`}
            onClick={() => onUserClick(user)}
          >
            <div className="flex items-center space-x-3">
              <Image
                src={user.image || "/default-avatar.png"}
                alt={user.name}
                className="w-8 h-8 rounded-full"
                width={32}                               // Kích thước cố định (bắt buộc với next/image)
                height={32}
              />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListUsers;
