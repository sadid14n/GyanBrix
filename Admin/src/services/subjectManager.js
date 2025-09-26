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

// 📌 Add Subject inside a Class
export const addSubject = async (classId, name, user) => {
  const ref = collection(firestoreDB, "classes", classId, "subjects");
  return await addDoc(ref, {
    name,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
  });
};

// 📌 Update Subject
export const updateSubject = async (classId, subjectId, name) => {
  const ref = doc(firestoreDB, "classes", classId, "subjects", subjectId);
  return await updateDoc(ref, { name });
};

// 📌 Delete Subject
// export const deleteSubject = async (classId, subjectId) => {
//   const ref = doc(firestoreDB, "classes", classId, "subjects", subjectId);
//   return await deleteDoc(ref);
// };
export const deleteSubject = async (classId, subjectId) => {
  if (!classId || !subjectId) {
    throw new Error("deleteSubject: missing classId or subjectId");
  }

  const ref = doc(firestoreDB, "classes", classId, "subjects", subjectId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error(
      `Subject not found at classes/${classId}/subjects/${subjectId}`
    );
  }

  await deleteDoc(ref);
  return true;
};

// 📌 Get Single Subject
export const getSubject = async (classId, subjectId) => {
  const ref = doc(firestoreDB, "classes", classId, "subjects", subjectId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, classId, ...snap.data() }; // include classId
};

// 📌 Get All Subjects of a Class
export const getAllSubjects = async (classId) => {
  const ref = collection(firestoreDB, "classes", classId, "subjects");
  const querySnapshot = await getDocs(ref);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    classId, // include classId for each subject
    ...doc.data(),
  }));
};
