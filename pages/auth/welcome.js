import { signIn } from 'next-auth/react';
import Image from 'next/image';

const WelcomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/sett.jpg')` }}>

      <div className="bg-white p-6 rounded-lg shadow-md w-[340px] h-[400px] flex">
        <div> 
          <div className='mt-[30px]'>
          <Image
             src="/logo_set.png" // Replace with the actual path to your image
             alt="Description of the image" 
             width={250} // Set the desired width of the image
             height={25} // Set the desired height of the image 
             className='mr-2 ml-5'
             />
          <h1 className="text-1xl font-semibold text-center mb-20">Khoa Kỹ thuật và Công nghệ - Xin chào!</h1>
         </div>
          <p className="text-gray-600 text-center mb-1">Đăng nhập vào Hồ sơ cố vấn học tập </p>
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full py-2 px-4 bg-gray-300 text-black rounded-lg shadow hover:bg-gray-400 flex"
          >
            <Image
             src="/gg.png" // Replace with the actual path to your image
             alt="Description of the image" 
             width={25  } // Set the desired width of the image
             height={25} // Set the desired height of the image 
             className='mr-2 ml-5'
             />
            Đăng nhập bằng Google
          </button>
        </div>
      </div>

    </div>
  );
};

export default WelcomePage;