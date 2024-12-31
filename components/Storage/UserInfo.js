import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image';
import React from 'react'

function UserInfo() {
    const { data: session } = useSession();

    return (
        <div>
            {session ?
                <div className='flex gap-3 items-center'>
                    <div className="flex items-center space-x-3 p-2 pr-4">
                        <Image src={session.user.image}
                            alt='user-image'
                            width={30}
                            height={30}
                            className='rounded-full' />
                        <div>
                            <h2 className='text-[13px] font-bold'>{session.user.name}</h2>
                            <h2 className='text-[10px] text-gray-400 mt-[-4px]'>{session.user.email}</h2>
                        </div>
                    </div>
                    <div>
                        <img
                            src="/logout.svg"
                            alt="Logout"
                            onClick={() => signOut()}
                            className="w-5 h-5 text-blue-500 hover:scale-110 hover:animate-pulse transition-transform duration-200" />
                    </div>
                </div> : null}
        </div>
    )
}

export default UserInfo

