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

// Add Chapter (supports text or PDF)
export const addChapter = async (classId, subjectId, formData, user) => {
  const ref = collection(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters"
  );

  console.log("ID:", classId, subjectId, formData);

  return await addDoc(ref, {
    ...formData, // title, content, chapterType, pdfUrl
    classId,
    subjectId,
    createdBy: user?.uid || "unknown",
    createdAt: serverTimestamp(),
  });
};

// 📌 Update Chapter
export const updateChapter = async (
  classId,
  subjectId,
  chapterId,
  title,
  content
) => {
  const ref = doc(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters",
    chapterId
  );
  return await updateDoc(ref, { title, content });
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
