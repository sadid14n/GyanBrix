// import firestore from "@react-native-firebase/firestore";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import { firebaseApp, firestoreDB } from "./firebaseConfig";

const db = getFirestore(firebaseApp);

/* --------------------------- 📚 CLASS FUNCTIONS --------------------------- */

export const getAllClasses = async () => {
  try {
    const q = collection(db, "classes");
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

/* -------------------------- 📘 SUBJECT FUNCTIONS -------------------------- */

export const getAllSubjects = async (classId) => {
  try {
    const q = collection(db, "classes", classId, "subjects");
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      classId,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error(`Error fetching subjects for class ${classId}:`, error);
    throw error;
  }
};

/* -------------------------- 📖 CHAPTER FUNCTIONS -------------------------- */

export const getAllChapters = async (classId, subjectId) => {
  try {
    const q = collection(
      db,
      "classes",
      classId,
      "subjects",
      subjectId,
      "chapters"
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
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
    const docRef = doc(
      db,
      "classes",
      classId,
      "subjects",
      subjectId,
      "chapters",
      chapterId
    );
    const docSnap = await getDoc(docRef);
    return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error(
      `Error fetching chapter ${chapterId} for class ${classId} and subject ${subjectId}:`,
      error
    );
    throw error;
  }
};

export const getClassName = async (classId) => {
  try {
    if (!classId) return "N/A";
    const classRef = doc(firestoreDB, "classes", classId);
    const classSnap = await getDoc(classRef);
    if (classSnap.exists()) {
      return classSnap.data().name || "Unknown Class";
    } else {
      return "Unknown Class";
    }
  } catch (error) {
    console.error("Error fetching class name:", error);
    return "Error";
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    await addDoc(collection(db, "feedback"), {
      ...feedbackData,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};
