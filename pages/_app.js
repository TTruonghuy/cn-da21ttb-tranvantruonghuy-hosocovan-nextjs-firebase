//import CreateFolderModal from "../components/Folder/CreateFolderModal";
import Toast from "../components/Toast";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

import { useState } from "react";
import { ShowToastContext } from "../context/ShowToastContext";
import { ParentFolderIdContext } from "../context/ParentFolderIdContext";
import Storage from "../components/Storage/Storage";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [showToastMsg, setShowToastMsg] = useState();
  const [parentFolderId, setParentFolderId] = useState();
  const router = useRouter();

  // Kiểm tra nếu route hiện tại là index hoặc welcome
  const isWelcomePage = router.pathname === "/auth/welcome"; // Thêm kiểm tra đường dẫn của trang welcome
  const isIndexPage = router.pathname === "/";

  return (
    <SessionProvider session={session}>
      <ParentFolderIdContext.Provider value={{ parentFolderId, setParentFolderId }}>
        <ShowToastContext.Provider value={{ showToastMsg, setShowToastMsg }}>
          <div className="flex flex-col h-screen">
            {/* Kiểm tra và chỉ hiển thị header nếu không phải trang welcome */}
            {!isWelcomePage && (
              <div className="w-full bg-white p-5 flex items-center justify-between border-b border-gray-300 sticky top-0 z-50">
                <div className="flex items-center space-x-3 pl-14">
                  <img src="/logo.ico" alt="Logo" className="w-16 h-16" /> {/* Logo */}
                  <span className="text-2xl font-semibold text-blue-900">
                    Hồ sơ cố vấn học tập
                  </span>
                </div>
                <Storage /> {/* Storage luôn hiển thị trong header */}
              </div>
            )}

            <div className={`flex flex-1 ${isIndexPage ? "" : ""}`}>
              {/* Nội dung chính */}
              <div className={`flex-1 ${isIndexPage ? "bg-white" : ""}`}>
                <Component {...pageProps} />
              </div>
            </div>
          </div>
          {/* Hiển thị Toast nếu có thông báo */}
          {showToastMsg ? <Toast msg={showToastMsg} /> : null}
        </ShowToastContext.Provider>
      </ParentFolderIdContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
