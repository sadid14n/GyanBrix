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

// 📌 Add Chapter inside a Subject
export const addChapter = async (classId, subjectId, name, user) => {
  const ref = collection(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters"
  );

  return await addDoc(ref, {
    name,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
  });
};

// 📌 Update Chapter
export const updateChapter = async (classId, subjectId, chapterId, name) => {
  const ref = doc(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters",
    chapterId
  );
  return await updateDoc(ref, { name });
};

// 📌 Delete Chapter
export const deleteChapter = async (classId, subjectId, chapterId) => {
  const ref = doc(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters",
    chapterId
  );
  return await deleteDoc(ref);
};

// 📌 Get Single Chapter
export const getChapter = async (classId, subjectId, chapterId) => {
  const ref = doc(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters",
    chapterId
  );
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

// 📌 Get All Chapters of a Subject
export const getAllChapters = async (classId, subjectId) => {
  const ref = collection(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters"
  );
  const querySnapshot = await getDocs(ref);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
