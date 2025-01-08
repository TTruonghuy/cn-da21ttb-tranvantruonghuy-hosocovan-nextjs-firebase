import React from 'react'
import UserInfo from './UserInfo'
import StorageInfo from './StorageInfo'
//import StorageDetailList from './StorageDetailList'
//import StorageUpgradeMsg from './StorageUpgradeMsg'
import { useSession } from 'next-auth/react'

function Storage() {
    const {data:session}=useSession();
  return session&&(
    <div className="flex flex-col items-end">
        <UserInfo/>
        <StorageInfo/>
    </div>
  )
}
export default Storage