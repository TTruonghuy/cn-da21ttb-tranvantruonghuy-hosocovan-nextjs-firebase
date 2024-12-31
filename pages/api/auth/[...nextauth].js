import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../../../Config/FirebaseConfig";

const db = getFirestore(app);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const userRef = doc(db, "users", user.email);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            name: user.name || "Unknown",
            email: user.email,
            image: user.image || null,
            phone: null,
            role: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "active",
            faculty: null,
            department: null,
          });
        }

        return true;
      } catch (error) {
        console.error("Error saving user data to Firestore:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/auth/welcome', // Đặt đường dẫn trang đăng nhập tùy chỉnh
  },
});
