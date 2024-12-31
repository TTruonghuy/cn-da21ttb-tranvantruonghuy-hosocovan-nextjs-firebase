import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { app } from "../Config/FirebaseConfig";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import FolderList from "../components/Folder/FolderList";
import FileList from "../components/File/FileList";
import ListUsers from "../components/ListUsers"; // Import ListUsers

function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [folders, setFolders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [folderList, setFolderList] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      const fetchUsersAndFolders = async () => {
        const db = getFirestore(app);
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);

        const folderData = {};
        for (const user of userList) {
          const folderQuery = query(
            collection(db, "Folders"),
            where("createBy", "==", user.email),
            where("parentFolderId", "==", 0),
            orderBy("createAt", "desc"),
            limit(1)
          );
          const folderSnapshot = await getDocs(folderQuery);
          folderData[user.email] = folderSnapshot.docs.map(doc => doc.data())[0] || null;
        }
        setFolders(folderData);
      };

      fetchUsersAndFolders();
    }
  }, [session, router]);

  const fetchUserFoldersAndFiles = async (userEmail) => {
    const db = getFirestore(app);
    const folderQuery = query(
      collection(db, "Folders"),
      where("createBy", "==", userEmail),
      where("parentFolderId", "==", 0)
    );
    const folderSnapshot = await getDocs(folderQuery);
    const fetchedFolders = folderSnapshot.docs.map(doc => doc.data());
    setFolderList(fetchedFolders);

    const fileQuery = query(
      collection(db, "files"),
      where("createdBy", "==", userEmail),
      where("parentFolderId", "==", 0)
    );
    const fileSnapshot = await getDocs(fileQuery);
    const fetchedFiles = fileSnapshot.docs.map(doc => doc.data());
    setFileList(fetchedFiles);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserFoldersAndFiles(user.email);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("selectedUser"));
    if (savedUser) {
      setSelectedUser(savedUser);
      fetchUserFoldersAndFiles(savedUser.email);
    }
  }, []);

  return (
    <div className="flex h-full w-screen">
      <ListUsers
        users={users}
        folders={folders}
        searchTerm={searchTerm}
        selectedUser={selectedUser}
        onUserClick={handleUserClick}
        onSearchChange={setSearchTerm}
      />
      <div className="flex-1 bg-white p-5">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold">{selectedUser.name}</h2>
            <FolderList folderList={folderList} />
            <FileList fileList={fileList} />
          </>
        ) : (
          <div>
            <h1 className="text-xl font-bold">Nội dung chính</h1>
            <p>Chọn một người dùng từ danh sách để xem chi tiết.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
