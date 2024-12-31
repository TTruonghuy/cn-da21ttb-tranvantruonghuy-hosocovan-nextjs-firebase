import React from "react";
import menu from "../data/menu"; // Dữ liệu menu
import CreateFolderModal from "./Folder/CreateFolderModal";
import UploadFileModal from "./File/UploadFileModal";
import { useSession } from "next-auth/react";

function SideNavBar({ onMenuClick, currentView }) {
  const { data: session } = useSession();

  return (
    session && (
      <div className="w-[200px] bg-white h-screen sticky top-0 z-10 shadow-blue-200 shadow-md p-5">
        {/* Nút Thêm tài liệu */}
        <button
          onClick={() => window.upload_file.showModal()}
          className="flex gap-2 items-center text-[14px] bg-blue-500 p-2 text-white rounded-md px-3 hover:scale-105 transition-all mt-5 w-full justify-center"
        >
          Thêm tài liệu
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Nút Thêm thư mục */}
        <button
          className="flex gap-2 items-center text-[14px] bg-sky-400 w-full p-2 justify-center text-white rounded-md px-3 hover:scale-105 transition-all mt-1"
          onClick={() => window.my_modal_3.showModal()}
        >
          Thêm thư mục
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Menu list */}
        <div className="mt-7">
          {menu.list.map((item, index) => (
            <h2
              key={index}
              onClick={() => onMenuClick(item)}
              className={`flex gap-2 items-center p-2 mt-3 rounded-md cursor-pointer transition-all ${
                currentView === item.id
                  ? "bg-blue-500 text-white hover:scale-105"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.logo}
                />
              </svg>
              {item.name}
            </h2>
          ))}
        </div>

        {/* Modals */}
        <dialog id="my_modal_3" className="modal">
          <CreateFolderModal />
        </dialog>
        <dialog id="upload_file" className="modal">
          <UploadFileModal closeModal={() => window.upload_file.close()} />
        </dialog>
      </div>
    )
  );
}

export default SideNavBar;
