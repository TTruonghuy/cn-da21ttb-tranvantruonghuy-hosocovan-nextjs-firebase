import { useSession } from "next-auth/react";
import { getDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../Config/FirebaseConfig"; // Điều chỉnh đường dẫn nếu cần
import { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar";
import Image from "next/image";
import { useRouter } from 'next/router';

function Profile() {
  const router = useRouter();  // Sử dụng router để điều hướng
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const db = getFirestore(app);
  const [currentView, setCurrentView] = useState("profile");

  useEffect(() => {
    if (!session) {
      router.push('/login');
    } else {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", session.user.email);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setFormData(docSnap.data()); // Khởi tạo form data
        } else {
          console.log("User not found in Firestore");
        }
      };

      fetchUserData();
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", session.user.email);
      await updateDoc(userRef, formData);
      setUserData(formData); // Cập nhật dữ liệu hiển thị
      setEditing(false);
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
    }
  };

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const onMenuClick = (item) => {
    setCurrentView(item.id);
  };

  return (
    <div className="flex">
      <div className='sticky top-[105px] left-0 h-full z-10'><SideNavBar onMenuClick={onMenuClick} currentView={currentView} /></div>

      <div className="profile-container flex-1 p-5 bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            {userData.image ? (
              <Image
                src={userData.image}
                alt="User Avatar"
                width={100}
                height={100}
                className="rounded-full border-2 border-gray-300"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl">
                {userData.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="ml-4 text-2xl font-bold">{userData.name}</h2>
          </div>

          <div className="profile-info space-y-4">
            {editing ? (
              <>
                <div>
                  <label><strong>Email liên hệ:</strong></label>
                  <input
                    type="email"
                    name="emailcontact"
                    value={formData.emailcontact}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 mt-1"
                  />
                </div>
                <div>
                  <label><strong>Số điện thoại:</strong></label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 mt-1"
                  />
                </div>
                <div>
                  <label><strong>Khoa:</strong></label>
                  <input
                    type="text"
                    name="faculty"
                    value={formData.faculty || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 mt-1"
                  />
                </div>
                <div>
                  <label><strong>Bộ môn:</strong></label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Lưu
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="flex"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                  <strong>Email liên hệ:</strong> {userData.emailcontact}</p>
                <p className="flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                  <strong>Số điện thoại:</strong> {userData.phone || "N/A"}</p>
                <p className="flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>
                  <strong>Khoa:</strong> {userData.faculty || "N/A"}</p>
                <p className="flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                  <strong>Bộ môn:</strong> {userData.department || "N/A"}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex ml-[550px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Chỉnh sửa
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
