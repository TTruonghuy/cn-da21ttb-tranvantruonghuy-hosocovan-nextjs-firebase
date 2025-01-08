import Image from 'next/image'
import React from 'react'

function FolderItem({folder}) {
  return (
    <div className={`w-[120px]
    flex flex-col justify-center 
    items-center h-full
    border-[1px] 
    rounded-lg p-4 bg-white
    hover:scale-105 hover:shadow-md
    cursor-pointer `}>
        <Image src='/folder.png'
        alt='folder'
        width={50}
        height={50}
        />
        <h2 className='line-clamp-2
        text-[12px] text-center'>{folder.name}</h2>
    </div>
  )
}

export default FolderItem