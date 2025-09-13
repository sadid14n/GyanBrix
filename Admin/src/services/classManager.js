import { firestoreDB } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// 📌 Add Class
export const addClass = async (name, user) => {
  return await addDoc(collection(firestoreDB, "classes"), {
    name,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
  });
};

// 📌 Update Class
export const updateClass = async (classId, name) => {
  const ref = doc(firestoreDB, "classes", classId);
  return await updateDoc(ref, { name });
};

// 📌 Delete Class
export const deleteClass = async (classId) => {
  const ref = doc(firestoreDB, "classes", classId);
  return await deleteDoc(ref);
};

// 📌 Get Single Class
export const getClass = async (classId) => {
  const ref = doc(firestoreDB, "classes", classId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

// 📌 Get All Classes
export const getAllClasses = async () => {
  const querySnapshot = await getDocs(collection(firestoreDB, "classes"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
