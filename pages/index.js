import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../Config/FirebaseConfig';
import { ParentFolderIdContext } from '../context/ParentFolderIdContext';
import { ShowToastContext } from '../context/ShowToastContext';
import FolderList from '../components/Folder/FolderList';
import FileList from '../components/File/FileList';
import SideNavBar from '../components/SideNavBar';  // Import SideNavBar
import Profile from '../components/Users/Profile';  // Import Profile component

export default function Home() {
  const { data: session } = useSession();  // Lấy dữ liệu session
  const router = useRouter();  // Sử dụng router để điều hướng
  const [folderList, setFolderList] = useState([]);  // State chứa danh sách thư mục
  const [fileList, setFileList] = useState([]);  // State chứa danh sách file
  const [currentView, setCurrentView] = useState('home');  // State để quản lý nội dung hiển thị
  const db = getFirestore(app);  // Khởi tạo Firestore
  const { parentFolderId, setParentFolderId } = useContext(ParentFolderIdContext);  // Context lấy `parentFolderId`
  const { showToastMsg, setShowToastMsg } = useContext(ShowToastContext);  // Context để hiển thị thông báo

  useEffect(() => {
    if (!session) {
      router.push('/login');  // Nếu chưa đăng nhập, chuyển hướng về trang login
    } else {
      setFolderList([]);  // Reset lại danh sách thư mục
      getFolderList();  // Lấy danh sách thư mục
      setFileList([]);
      getFileList();  // Lấy danh sách file
    }
    setParentFolderId(0);  // Đặt lại parentFolderId về 0 (thư mục gốc)
  }, [session, showToastMsg]);

  const getFolderList = async () => {
    const q = query(
      collection(db, 'Folders'),
      where('parentFolderId', '==', 0),  // Lọc các thư mục có parentFolderId là 0
      where('createBy', '==', session.user.email)  // Lọc thư mục của người dùng hiện tại
    );

    const querySnapshot = await getDocs(q);  // Lấy dữ liệu từ Firestore
    querySnapshot.forEach((doc) => {
      setFolderList((folderList) => [...folderList, doc.data()]);  // Cập nhật danh sách thư mục
    });
  };

  const getFileList = async () => {
    const q = query(
      collection(db, 'files'),
      where('parentFolderId', '==', 0),  // Lọc các file có parentFolderId là 0
      where('createdBy', '==', session.user.email)  // Lọc file của người dùng hiện tại
    );

    const querySnapshot = await getDocs(q);  // Lấy dữ liệu từ Firestore
    querySnapshot.forEach((doc) => {
      setFileList((fileList) => [...fileList, doc.data()]);  // Cập nhật danh sách file
    });
  };

  // Hàm xử lý click menu
  const onMenuClick = (item) => {
    setCurrentView(item.id);
  };

  return (
    <>
      <Head>
        <title>Quản lý hồ sơ</title>
        <meta name="description" content="Trang chính của ứng dụng quản lý thư mục và file." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex">
        {/* Hiển thị SideNavBar ở bên trái */}
        <SideNavBar onMenuClick={onMenuClick} currentView={currentView} />
        

        <div className="p-6 flex-1">
          {currentView === 'profile' ? (
            <Profile userEmail={session.user.email} />  // Hiển thị thông tin người dùng
          ) : (
            <>
              {/* Hiển thị danh sách thư mục và file */}
              <FolderList folderList={folderList} />
              <FileList fileList={fileList} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
