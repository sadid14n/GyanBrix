import { collection, getCountFromServer } from "firebase/firestore";
import { firestoreDB } from "../firebase/firebaseConfig";

// 📌 Get total registered users
export const getTotalUsers = async () => {
  try {
    const usersRef = collection(firestoreDB, "users");
    const snapshot = await getCountFromServer(usersRef);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting total users:", error);
    return 0;
  }
};

export const getTotalClasses = async () => {
  try {
    const classesRef = collection(firestoreDB, "classes");
    const snapshot = await getCountFromServer(classesRef);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting total classes:", error);
    return 0;
  }
};
