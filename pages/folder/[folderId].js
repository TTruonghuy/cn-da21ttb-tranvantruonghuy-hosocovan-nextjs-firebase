import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { ParentFolderIdContext } from '../../context/ParentFolderIdContext';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { app } from '../../Config/FirebaseConfig';
import { useSession } from 'next-auth/react';
import FolderList from '../../components/Folder/FolderList';
import { ShowToastContext } from '../../context/ShowToastContext';
import FileList from '../../components/File/FileList';
import SideNavBar from '../../components/SideNavBar';



function FolderDetails() {
   // const [isRoleLoading, setIsRoleLoading] = useState(true);
    const router = useRouter();
    const { name, id } = router.query;
    const { data: session } = useSession();
    const { parentFolderId, setParentFolderId } = useContext(ParentFolderIdContext);
    const { showToastMsg, setShowToastMsg } = useContext(ShowToastContext);

    const [folderList, setFolderList] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [role, setRole] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const [showRestoreDeleteForm, setShowRestoreDeleteForm] = useState(false);
    const db = getFirestore(app);
    const formRef = useRef(null);
    const [formPosition, setFormPosition] = useState({ top: 0, left: 0 });
    const [currentView, setCurrentView] = useState('home');
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    useEffect(() => {
        // Add event listener for clicks
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowRestoreDeleteForm(false); // Hide form if clicked outside
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener on component unmount
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!id) return;
        if (session) {
            const getRoleFromFirestore = async () => {
                setIsRoleLoading(true); // Bắt đầu tải dữ liệu role
                try {
                    const userRef = doc(db, "users", session.user.email);
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const userRole = docSnap.data().role;
                        setRole(userRole);
                    } else {
                        console.error('User not found in Firestore');
                    }
                } catch (error) {
                    console.error("Error fetching role:", error);
                } finally {
                    setIsRoleLoading(false); // Kết thúc tải dữ liệu role
                }
            };
            getRoleFromFirestore();
        }

        setParentFolderId(id);
        if (session || showToastMsg != null) {
            setFolderList([]);
            setFileList([]);
            getFolderList();
            getFileList();
        }

        // Use onSnapshot to listen for real-time updates
        const folderRef = doc(db, "Folders", id);
        const unsubscribe = onSnapshot(folderRef, (folderDoc) => {
            if (folderDoc.exists()) {
                const folderData = folderDoc.data();
                setIsDeleted(folderData.delete);  // Update isDeleted based on real-time Firestore data
            } else {
                console.error("Folder not found");
            }
        });

        // Clean up the listener when the component is unmounted or id changes
        return () => unsubscribe();

    }, [id, session, showToastMsg]);  // Watch for `id`, `session`, and `showToastMsg`


    // Mark folder as deleted
    const deleteFolder = async () => {
        await updateDoc(doc(db, "Folders", id), {
            delete: true,
        }).then(() => {
            setShowToastMsg('Folder marked as deleted!');
            setIsDeleted(true);
            router.back();
        });
    };

    // Restore folder
    const restoreFolder = async () => {
        await updateDoc(doc(db, "Folders", id), {
            delete: false,
        }).then(() => {
            setShowToastMsg('Folder restored!');
            setIsDeleted(false);
            setShowRestoreDeleteForm(false);
            router.back();
        });
    };

    const getFolderList = async () => {
        setFolderList([]);
        const q = query(
            collection(db, "Folders"),
            where("parentFolderId", "==", id),
            where("delete", "==", false)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setFolderList((folderList) => [...folderList, doc.data()]);
        });
    };

    const getFileList = async () => {
        setFileList([]);
        const q = query(
            collection(db, "files"),
            where("parentFolderId", '==', id),
            where("delete", "==", false)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const updatedFileList = [];
            querySnapshot.forEach((doc) => {
                updatedFileList.push({ id: doc.id, ...doc.data() });
            });
            setFileList(updatedFileList);
        });

        return unsubscribe;
    };

    const isAdmin = role === 0;
    //const isUser = role === 1;

    const handleIconClick = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setFormPosition({
            top: rect.bottom + 8,
            left: rect.left + rect.width / 2 - 90,
        });
        setShowRestoreDeleteForm(true);
    };

    const onMenuClick = (item) => {
        setCurrentView(item.id);
    };

    const goBack = () => {
        router.back(); // Quay lại trang trước trong lịch sử
    };

    return (
        <div className='flex'>
            {!isRoleLoading &&!isAdmin && <div className='sticky top-[105px] left-0 h-full z-10'><SideNavBar onMenuClick={onMenuClick} currentView={currentView} /></div>}
            <div className='p-5 flex-grow bg-white'>
                <h2 className='text-[20px] font-bold grid grid-cols-2
        lg:grid-cols-3 mb-3'>
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 float-right text-black hover:scale-105 hover:text-blue-500 transition-all cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
                        </svg>
                        Trở lại
                    </button> 
                  <div className='flex justify-center items-center col-span-2 lg:col-span-1'>{name}</div> 
                    {/* Hiển thị biểu tượng thùng rác nếu folder chưa bị xóa */}
                    {!isAdmin && !isDeleted && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={deleteFolder}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-7 h-7 float-right text-red-500 hover:scale-110 transition-all cursor-pointer ml-72"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    )}
                    {/* Hiển thị biểu tượng 3 chấm nếu folder đã bị xóa */}
                    {isDeleted && (
                        <button onClick={handleIconClick} className="w-6 h-6 float-right text-black hover:scale-110 transition-all cursor-pointer ml-72">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </button>
                    )}
                </h2>

                {showRestoreDeleteForm && (
                    <div
                        ref={formRef}
                        style={{
                            position: "fixed",
                            top: formPosition.top,
                            left: formPosition.left,
                        }}
                        className="bg-white border rounded-md shadow-md p-3 z-50"
                    >
                        <button onClick={restoreFolder} className="block w-full text-left hover:bg-gray-200 mb-2">Khôi phục</button>
                        <button onClick={deleteFolder} className="block w-full text-left hover:bg-gray-200 mb-2 text-red-500">Xoá vĩnh viễn</button>
                    </div>
                )}

                {folderList.length > 0 ? (
                    <FolderList folderList={folderList} isBig={false} />
                ) : (
                    <h2 className='text-gray-400 text-[16px] mt-5'>No Folder Found</h2>
                )}

                <FileList fileList={fileList} />
            </div>
        </div>
    );
}

export default FolderDetails;
