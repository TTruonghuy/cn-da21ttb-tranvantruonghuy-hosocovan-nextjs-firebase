import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { app } from '../../Config/FirebaseConfig'
import { useSession } from 'next-auth/react'
import StorageSize from '../../Services/StorageSize';

function StorageInfo() {
  const { data: session } = useSession();
  const db = getFirestore(app)
  const [totalSizeUsed, setTotalSizeUsed] = useState(0);
  const [imageSize, setImageSize] = useState(0);

  const [fileList, setFileList] = useState([])
  let totalSize = 0;
  useEffect(() => {
    if (session) {
      totalSize = 0;
      getAllFiles();

    }
  }, [session])

  useEffect(() => {
    setImageSize(StorageSize.getStorageByType(fileList, ['png', 'jpg']));
  }, [fileList])
  const getAllFiles = async () => {
    const q = query(collection(db, "files"),
      where("createdBy", "==", session.user.email));
    const querySnapshot = await getDocs(q);
    setFileList([])
    querySnapshot.forEach((doc) => {

      totalSize = totalSize + doc.data()['size'];
      setFileList(fileList => ([...fileList, doc.data()]))

    })

    setTotalSizeUsed((totalSize / 1024 ** 2).toFixed(2) + " MB");

  }

  return (
    <div className="pr-24">
      <h2 className="text-[10px] font-semibold" >
        Đã dùng {totalSizeUsed} {" "} 
      </h2>
    </div>
  )
}

export default StorageInfo