import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Select from 'react-select';
import { app } from '../Config/FirebaseConfig';
import Image from 'next/image';

function App() {
  const { data: session } = useSession();
  const router = useRouter();
  const db = getFirestore(app);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // Kiểm tra session và role người dùng khi đã đăng nhập
  useEffect(() => {
    const checkUserRole = async () => {
      if (session) {
        const userRef = doc(db, 'users', session.user.email);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userRole = docSnap.data().role;
          if (userRole === 0) {
            router.push('/admin'); // Chuyển đến trang admin nếu là admin
          } else {
            router.push('/'); // Chuyển đến trang chủ nếu là người dùng thường
          }
        } else {
          console.error('User not found in Firestore');
        }
      }
    };

    checkUserRole();
  }, [session, router, db]);

  // Lấy danh sách tất cả user từ Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
      .filter(doc => doc.data().role !== 0) // Loại bỏ user có role = 0
      .map(doc => ({
        value: doc.id,
        label: doc.data().name || 'Unknown',
      }));
    setUsers(usersList);
    };

    fetchUsers();
  }, [db]);

  // Xử lý tìm kiếm user khi nhấn nút
  const handleSearch = async () => {
    if (selectedUser) {
      const userRef = doc(db, 'users', selectedUser.value);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.error('User not found');
      }
    }
  };

  const handleLogin = () => {
    router.push('/auth/welcome'); // Điều hướng đến trang giới thiệu
  };

  const handleClearUserData = () => {
    setUserData(null);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="flex flex-col bg-white">
        <div className="login-container bg-white">
          <div className='fixed flex mt-4 right-20 z-10'>
            <p className='mt-2 mr-2 text-gray-600 flex'>Truy cập Hồ sơ cố vấn học tập
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mt-[6px]">
                <path fillRule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </p>
            <button
              onClick={handleLogin}
              className="  px-4 py-2 bg-blue-800 text-white rounded shadow hover:bg-blue-600 flex">
              Đăng nhập
            </button>
          </div>
        </div>

        {/* Giao diện tìm kiếm người dùng */}
        <div className="pl-6 pr-6 pb-6 flex flex-col items-center justify-center h-[546px]">
          <div className="relative w-full h-[550px]">
            <Image
              src="/logo_set.png"
              alt="Logo Set"
              width={650}
              height={550}
              className="object-cover mt-[130px] ml-[325px] opacity-60"
            />
            <div className="absolute top-0 left-0 w-full h-auto flex justify-center">
              <div className="bg-white bg-opacity-80 p-6 rounded shadow-lg mt-28">
                <h2 className="text-xl text-gray-600 mb-4">Tra cứu thông tin Cố Vấn học tập - Khoa Kỹ thuật và Công nghệ</h2>
                <div className="flex gap-4 w-[500px]">
                  <Select
                    options={users}
                    value={selectedUser}
                    onChange={setSelectedUser}
                    placeholder="Chọn người dùng..."
                    className="flex-1"
                    isSearchable={true}
                    isClearable={true}
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 flex"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {userData && (
            <div className="bg-white bg-opacity-80 p-4 w-[900px] absolute mt-[250px] rounded shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold mb-2">Thông tin liên hệ Cố vấn học tập</h3>
                <button onClick={handleClearUserData}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 hover:scale-125 mb-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-start gap-6 ml-10">
                {/* Ảnh người dùng */}
                <div className="w-44 h-44 flex-shrink-0 rounded-full overflow-hidden border border-gray-300 mt-5">
                  <img
                    src={userData.image || 'https://via.placeholder.com/150'}
                    alt="Ảnh người dùng"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thông tin người dùng */}
                <div className='mt-10 ml-4'>
                  <p>
                    <strong>Tên:</strong> {userData.name || 'N/A'}
                  </p>
                  <p>
                    <strong>Email liên hệ:</strong> {userData.emailcontact || 'N/A'}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {userData.phone || 'N/A'}
                  </p>
                  <p>
                    <strong>Khoa:</strong> {userData.faculty || 'N/A'}
                  </p>
                  <p>
                    <strong>Bộ môn:</strong> {userData.department || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>


        {/* Chân trang */}
        <footer className="bg-blue-900 text-white text-center p-6">
          <div className="mb-2">
            <p className="text-lg font-semibold">
              Quản lý hồ sơ cố vấn học tập - Khoa Kỹ thuật và Công nghệ
            </p>
            <p className="text-sm">
              Đồ án chuyên ngành | Trường Đại học Trà Vinh
            </p>
          </div>
          <div className="mb-2">
            <p>Sinh viên thực hiện: <strong>Trần Văn Trường Huy</strong></p>
            <p>Lớp: DA21TTB | MSSV: 110121028</p>
          </div>
          <div className="mb-2">
            <p>Email: <a href="mailto:tranvantruonghuyy@gmail.com" className="text-blue-400 hover:underline">tranvantruonghuyy@gmail.com</a></p>
            <p>SĐT: <a href="tel:0362875750" className="text-blue-400 hover:underline">0362875750</a></p>
          </div>
          <p className="text-xs">
            © 2024 Quản lý hồ sơ cố vấn học tập. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
