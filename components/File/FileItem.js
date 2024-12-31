import { doc, getFirestore, updateDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useContext,useEffect, useRef, useState } from "react";
import moment from "moment/moment";
import { app } from "../../Config/FirebaseConfig";

function FileItem({ file }) {
  const db = getFirestore(app);
  const image = "/" + file.type + ".png";
  //const { showToastMsg, setShowToastMsg } = useContext(ShowToastContext);
  const [showOptions, setShowOptions] = useState(false); // State hiển thị form
  const [formPosition, setFormPosition] = useState({ top: 0, left: 0 }); // Vị trí của form
  const formRef = useRef(null); // Ref để xử lý sự kiện click ngoài form

  const handleIconClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setFormPosition({
      top: rect.bottom + 5, // Khoảng cách dưới icon
      left: rect.left, // Thẳng hàng với icon
    });
    setShowOptions(true);
  };

  const handleDoubleClick = (event) => {
    setFormPosition({
      top: event.clientY + 5, // Vị trí chuột + khoảng cách
      left: event.clientX,
    });
    setShowOptions(true);
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowOptions(false); // Đóng form nếu click ra ngoài
    }
  };

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  // Chức năng tải xuống
  const handleDownload = () => {
    const link = document.createElement("a"); // Tạo thẻ <a> tạm thời
    link.href = file.imageUrl; // URL của file
    link.download = file.name; // Tên file tải xuống
    document.body.appendChild(link); // Thêm thẻ <a> vào DOM
    link.click(); // Kích hoạt sự kiện click để tải xuống
    document.body.removeChild(link); // Xóa thẻ <a> sau khi tải
    setShowOptions(false); // Đóng form sau khi tải xuống
  };

  // Chức năng xóa
  const handleDelete = async () => {
    try {
      const fileRef = doc(db, "files", file.id.toString());
      await updateDoc(fileRef, { delete: true }); // Cập nhật delete = true
      alert("File đã được chuyển sang thùng rác.");
      setShowOptions(false); // Đóng form sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa file:", error);
    }
  };

  return (
    <div
      className="relative grid grid-cols-1 md:grid-cols-2 justify-between hover:bg-gray-100 p-3 rounded-md select-none"
      onDoubleClick={handleDoubleClick} // Hiển thị form khi click đôi
    >
      <div className="flex gap-2 items-center">
        <Image src={image} alt="file-icon" width={26} height={20} />
        <h2 className="text-[15px] truncate">{file.name}</h2>
      </div>
      <div className="grid grid-cols-3 place-content-start">
        <h2 className="text-[15px]">{moment(file.modifiedAt).format("MMMM DD, YYYY")}</h2>
        <h2 className="text-[15px]">{(file.size / 1024 ** 2).toFixed(2) + " MB"}</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleIconClick}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 float-right text-gray-500 hover:scale-110 transition-all"
        >
          <path d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
      </div>

      {/* Form nhỏ hiện ra */}
      {showOptions && (
        <div
          ref={formRef}
          style={{
            position: "fixed", // Sử dụng fixed thay vì absolute
            top: formPosition.top,
            left: formPosition.left,
          }}
          className="bg-white border rounded-md shadow-md p-3 z-50"
        >
          <button
            onClick={() => alert("Chức năng Xem đang được phát triển!")} // Placeholder
            className="block w-full text-left hover:bg-gray-200 mb-2"
          >
            Xem
          </button>
          <button
            onClick={handleDownload}
            className="block w-full text-left hover:bg-gray-200 mb-2"
          >
            Tải xuống
          </button>
          <button
            onClick={handleDelete}
            className="block w-full text-left text-red-500 hover:bg-gray-200 mb-2"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
}

export default FileItem;
