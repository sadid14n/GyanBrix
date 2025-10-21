import firestore from "@react-native-firebase/firestore";

/* --------------------------- 📚 CLASS FUNCTIONS --------------------------- */
export const getAllClasses = async () => {
  try {
    const snapshot = await firestore().collection("classes").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

/* -------------------------- 📘 SUBJECT FUNCTIONS -------------------------- */
export const getAllSubjects = async (classId) => {
  try {
    const snapshot = await firestore()
      .collection("classes")
      .doc(classId)
      .collection("subjects")
      .get();

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
    const snapshot = await firestore()
      .collection("classes")
      .doc(classId)
      .collection("subjects")
      .doc(subjectId)
      .collection("chapters")
      .get();

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
    const docSnap = await firestore()
      .collection("classes")
      .doc(classId)
      .collection("subjects")
      .doc(subjectId)
      .collection("chapters")
      .doc(chapterId)
      .get();

    return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error(
      `Error fetching chapter ${chapterId} for class ${classId} and subject ${subjectId}:`,
      error
    );
    throw error;
  }
};
