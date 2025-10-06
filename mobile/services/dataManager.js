import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestoreDB } from "./firebaseConfig";

/* --------------------------- 📚 CLASS FUNCTIONS --------------------------- */
export const getAllClasses = async () => {
  try {
    const snapshot = await getDocs(collection(firestoreDB, "classes"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

/* -------------------------- 📘 SUBJECT FUNCTIONS -------------------------- */
export const getAllSubjects = async (classId) => {
  try {
    const ref = collection(firestoreDB, "classes", classId, "subjects");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      classId,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching subjects for class ${classId}:`, error);
    throw error;
  }
};

/* -------------------------- 📖 CHAPTER FUNCTIONS -------------------------- */
export const getAllChapters = async (classId, subjectId) => {
  try {
    const ref = collection(
      firestoreDB,
      "classes",
      classId,
      "subjects",
      subjectId,
      "chapters"
    );
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(
      `Error fetching chapters for class ${classId} and subject ${subjectId}:`,
      error
    );
    throw error;
  }
};

export const getChapter = async (classId, subjectId, chapterId) => {
  try {
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
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error(
      `Error fetching chapter ${chapterId} for class ${classId} and subject ${subjectId}:`,
      error
    );
    throw error;
  }
};
