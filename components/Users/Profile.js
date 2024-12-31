// components/Users/Profile.js
import { useSession } from "next-auth/react";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "../../Config/FirebaseConfig";
import { useEffect, useState } from "react";

function Profile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    if (session) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", session.user.email);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("User not found in Firestore");
        }
      };

      fetchUserData();
    }
  }, [session]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="text-2xl font-bold">User Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phone || "N/A"}</p>
        <p><strong>Status:</strong> {userData.status}</p>
        <p><strong>Faculty:</strong> {userData.faculty || "N/A"}</p>
        <p><strong>Department:</strong> {userData.department || "N/A"}</p>
        <p><strong>Role:</strong> {userData.role === 0 ? "Admin" : "User"}</p>
      </div>
    </div>
  );
}

export default Profile;
