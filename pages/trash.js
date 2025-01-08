import { useEffect, useState } from "react";
import { collection, getFirestore, query, where, onSnapshot } from "firebase/firestore";
import { app } from "../Config/FirebaseConfig";
import FolderList from "../components/Folder/FolderList";
import FileList from "../components/File/FileList";
import SideNavBar from "../components/SideNavBar";

function Trash() {
  const db = getFirestore(app);
  const [folderList, setFolderList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [currentView, setCurrentView] = useState('trash');

  useEffect(() => {
    const folderQuery = query(
      collection(db, "Folders"),
      where("delete", "==", true) // Lấy các thư mục có delete = true
    );

    const fileQuery = query(
      collection(db, "files"),
      where("delete", "==", true) // Lấy các file có delete = true
    );

    const unsubscribeFolders = onSnapshot(folderQuery, (snapshot) => {
      const updatedFolders = [];
      snapshot.forEach((doc) => {
        updatedFolders.push({ id: doc.id, ...doc.data() });
      });
      setFolderList(updatedFolders); // Cập nhật danh sách thư mục
    });

    const unsubscribeFiles = onSnapshot(fileQuery, (snapshot) => {
      const updatedFiles = [];
      snapshot.forEach((doc) => {
        updatedFiles.push({ id: doc.id, ...doc.data() });
      });
      setFileList(updatedFiles); // Cập nhật danh sách file
    });

    // Hủy đăng ký khi component bị unmount
    return () => {
      unsubscribeFolders();
      unsubscribeFiles();
    };
  }, []);

  const onMenuClick = (item) => {
    setCurrentView(item.id);
  };

  return (
    <div className="flex">
   <div className='sticky top-[105px] left-0 h-full z-10'><SideNavBar onMenuClick={onMenuClick} currentView={currentView} /></div>
    <div className="p-6 flex-1 bg-white">
      <h2 className="text-xl font-bold mb-4">Thùng rác</h2>
      <FolderList folderList={folderList} />
      <FileList fileList={fileList} />
    </div>
    </div>
  );
}

export default Trash;
