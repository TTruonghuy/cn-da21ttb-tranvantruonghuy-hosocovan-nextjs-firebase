import React, { useState } from 'react';
import FileItem from './FileItem';

function FileList({ fileList }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const filteredFiles = fileList.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white mt-5 p-5 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[12px] font-bold">Tài liệu</h2>
        <div className="relative mr-16">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tên file..."
            className=" border p-1 rounded-md text-[13px] outline-none"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 text-[13px] font-semibold border-b-[1px] pb-2 mt-3 border-gray-300 text-gray-400">
        <h2>Tên</h2>
        <div className="grid grid-cols-3">
          <h2>Thời gian</h2>
          <h2>Kích cỡ</h2>
          <h2></h2>
        </div>
      </div>

      {filteredFiles.map((item, index) => (
        <div key={index}>
          <FileItem file={item} key={index} />
        </div>
      ))}
    </div>
  );
}

export default FileList;
