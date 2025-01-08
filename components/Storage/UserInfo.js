import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image';
import React ,{useState}from 'react'

function UserInfo() {
    const { data: session } = useSession();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSignOut = () => {
        setShowConfirm(true); // Hiển thị hộp xác nhận
    };

    const confirmSignOut = () => {
        setShowConfirm(false); // Ẩn hộp xác nhận
        signOut(); // Thực hiện đăng xuất
    };

    const cancelSignOut = () => {
        setShowConfirm(false); // Ẩn hộp xác nhận
    };

     return (
        <div>
            {session ? (
                <div className="flex gap-3 items-center">
                    <div className="flex items-center space-x-3 p-2 pr-4">
                        <Image
                            src={session.user.image}
                            alt="user-image"
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                        <div>
                            <h2 className="text-[13px] font-bold">{session.user.name}</h2>
                            <h2 className="text-[10px] text-gray-400 mt-[-4px]">{session.user.email}</h2>
                        </div>
                    </div>
                    <div>
                        <img
                            src="/logout.svg"
                            alt="Logout"
                            onClick={handleSignOut}
                            className="w-5 h-5 text-blue-500 hover:scale-110 hover:animate-pulse transition-transform duration-200"
                        />
                    </div>
                </div>
            ) : null}

            {/* Hộp xác nhận đăng xuất */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                    <div className="bg-white p-4 rounded shadow-lg w-[250px]">
                        <p className="text-center mb-4 font-bold">Xác nhận đăng xuất</p>
                        <div className="flex justify-around">
                           
                            <button
                                onClick={cancelSignOut}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 w-24"
                            >
                                Huỷ
                            </button>

                             <button
                                onClick={confirmSignOut}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserInfo