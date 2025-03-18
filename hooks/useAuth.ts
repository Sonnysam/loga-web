/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/lib/stores/authStore";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const ADMIN_EMAIL = "admin@loga.com"; // You can use this email to login as admin
const ADMIN_PASSWORD = "admin123"; // Use this password for admin login

export const useAuth = () => {
  const { setUser, setUserRole, setUserData, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        const isAdmin = user.email === ADMIN_EMAIL || userData?.isAdmin;
        setUserRole({ isAdmin });

        if (userData) {
          setUserData({
            id: user.uid,
            name: userData.name || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            yearGroup: userData.yearGroup || "",
            occupation: userData.occupation || "",
            institution: userData.institution || "",
            isAdmin,
            createdAt: userData.createdAt || new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
        setUserRole(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setUserRole, setUserData, setLoading]);

  return useAuthStore();
};

// Export admin credentials for easy access
export const adminCredentials = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};

// Add this function to create admin account
export const createAdminAccount = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: "Admin",
      email: ADMIN_EMAIL,
      phoneNumber: "",
      yearGroup: "",
      occupation: "Administrator",
      institution: "",
      isAdmin: true,
      createdAt: new Date().toISOString(),
    });

    return true;
  } catch (error: any) {
    if (error.code !== "auth/email-already-in-use") {
      console.error("Error creating admin:", error);
    }
    return false;
  }
};
