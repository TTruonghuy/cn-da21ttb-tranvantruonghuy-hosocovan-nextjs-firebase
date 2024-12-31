import React from 'react'
import StorageDetailItem from './StorageDetailItem';

function StorageDetailList() {
    const storageList = [
      ];
  return (
    <>
    {storageList.map((item,index)=>(
     <StorageDetailItem item={item} key={index} />

    ))}
      
    </>
  )
}

export default StorageDetailList