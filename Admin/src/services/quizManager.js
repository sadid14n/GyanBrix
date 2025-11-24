// src/services/quizManager.js
import { firestoreDB } from "../firebase/firebaseConfig";
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

/**
 * 📌 Get all questions of a chapter
 */
export const getQuestionsByChapter = async (classId, subjectId, chapterId) => {
  const ref = collection(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters",
    chapterId,
    "questions"
  );

  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addQuestionsBulk = async (
  classId,
  subjectId,
  chapterId,
  questions,
  user
) => {
  if (!questions || questions.length === 0) return;

  const questionsCol = collection(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters",
    chapterId,
    "questions"
  );

  // 🔥 Use batch so either all questions are added or none (atomic)
  const batch = writeBatch(firestoreDB);

  questions.forEach((q) => {
    const newDoc = doc(questionsCol); // auto ID
    batch.set(newDoc, {
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation || "",
      difficulty: q.difficulty || "medium",
      marks: typeof q.marks === "number" ? q.marks : 1,
      usage: [], // will be filled when used in quizzes
      classId,
      subjectId,
      chapterId,
      createdBy: user?.uid || "admin",
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();
};

/**
 * 📌 Update a single question
 */
export const updateQuestion = async (
  classId,
  subjectId,
  chapterId,
  questionId,
  payload
) => {
  const ref = doc(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters",
    chapterId,
    "questions",
    questionId
  );
  await updateDoc(ref, payload);
};

/**
 * 📌 Delete a single question
 */
export const deleteQuestion = async (
  classId,
  subjectId,
  chapterId,
  questionId
) => {
  const ref = doc(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters",
    chapterId,
    "questions",
    questionId
  );
  await deleteDoc(ref);
};
