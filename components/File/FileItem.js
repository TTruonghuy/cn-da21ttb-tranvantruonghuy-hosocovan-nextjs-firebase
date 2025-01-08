import { doc, getDoc, getFirestore, updateDoc, deleteDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment/moment";
import { app } from "../../Config/FirebaseConfig";
import { useSession } from 'next-auth/react'; 

function FileItem({ file }) {
  const db = getFirestore(app);
  const image = `/${file.type}.png`;
  const [showOptions, setShowOptions] = useState(false);
  const [formPosition, setFormPosition] = useState({ top: 0, left: 0 });
  const formRef = useRef(null);
  const { data: session } = useSession();
  const [role, setRole] = useState(null);

  // Lấy role của người dùng từ sessionStorage hoặc Firestore
  useEffect(() => {
    if (session) {
                const getRoleFromFirestore = async () => {
                    const userRef = doc(db, "users", session.user.email);
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const userRole = docSnap.data().role;
                        setRole(userRole);
                    } else {
                        console.error('User not found in Firestore');
                    }
                };
                getRoleFromFirestore();
            }
  }, []); // Chạy một lần khi component mount

  const handleIconClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setFormPosition({
      top: rect.top,
      left: rect.left - 125,
    });
    setShowOptions(true);
  };

  const handleDoubleClick = () => {
    window.open(file.imageUrl, "_blank"); // Tải file
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowOptions(false);
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

  const handleDownload = () => {
    window.open(file.imageUrl, "_blank");
    setShowOptions(false);
  };

  const handleDelete = async () => {
    try {
      const fileRef = doc(db, "files", file.id.toString());
      await updateDoc(fileRef, { delete: true });
      setShowOptions(false);
    } catch (error) {
      console.error("Lỗi khi xóa file:", error);
    }
  };

  const handleRestore = async () => {
    try {
      const fileRef = doc(db, "files", file.id.toString());
      await updateDoc(fileRef, { delete: false });
      setShowOptions(false);
    } catch (error) {
      console.error("Lỗi khi khôi phục file:", error);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      const fileRef = doc(db, "files", file.id.toString());
      await deleteDoc(fileRef);
      setShowOptions(false);
    } catch (error) {
      console.error("Lỗi khi xóa vĩnh viễn file:", error);
    }
  };

  const isAdmin = role === 0;

  return (
    <div
      className="relative grid grid-cols-1 md:grid-cols-2 justify-between hover:bg-gray-100 p-3 rounded-md select-none"
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex gap-2 items-center">
        <Image src={image} alt="file-icon" width={26} height={20} />
        <h2 className="text-[15px] truncate">{file.name}</h2>
       
      </div>
      <div className="grid grid-cols-3 place-content-start">
        <h2 className="text-[15px]">{moment(file.modifiedAt).format("MMMM DD, YYYY")}</h2>
        <h2 className="text-[15px]">{(file.size / 1024 ** 2).toFixed(2) + " MB"}</h2>
        {!isAdmin && ( // Ẩn nút nếu role là 0
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
        )}
      </div>

      {showOptions && (
        <div
          ref={formRef}
          style={{
            position: "fixed",
            top: formPosition.top,
            left: formPosition.left,
          }}
          className="bg-white border rounded-md shadow-md p-3 z-50"
        >
          {file.delete ? (
            <>
              <button
                onClick={handleRestore}
                className="block w-full text-left hover:bg-gray-200 mb-2"
              >
                Khôi phục
              </button>
              <button
                onClick={handlePermanentDelete}
                className="block w-full text-left text-red-500 hover:bg-gray-200 mb-2">
                Xóa vĩnh viễn
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default FileItem;
