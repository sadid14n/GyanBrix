import { firestoreDB } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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

// 📌 Get All Classes
export const getAllClasses = async () => {
  const querySnapshot = await getDocs(collection(firestoreDB, "classes"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 📌 Add Subject inside Class
export const addSubject = async (classId, name) => {
  const ref = collection(firestoreDB, "classes", classId, "subjects");
  return await addDoc(ref, { name });
};

// 📌 Add Chapter inside Subject
export const addChapter = async (classId, subjectId, name, content) => {
  const ref = collection(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters"
  );
  return await addDoc(ref, { name, content });
};
