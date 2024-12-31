import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../Config/FirebaseConfig';

function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra session và role người dùng khi đã đăng nhập
    const checkUserRole = async () => {
      if (session) {
        const db = getFirestore(app);
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
  }, [session, router]);

  const handleLogin = () => {
    router.push('/auth/welcome'); // Điều hướng đến trang giới thiệu
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="login-container h-[498px]">
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 ml-[1230px] mt-2">
            Đăng nhập
          </button>
        </div>
        {/* Chân trang */}
        <footer className="bg-gray-200 text-center p-4">
          <p>© 2024 Hồ sơ cố vấn học tập. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default Login;
