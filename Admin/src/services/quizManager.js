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
  arrayUnion,
  addDoc,
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

// chapter level quiz creation
export const createChapterQuiz = async ({
  classId,
  subjectId,
  chapterId,
  title,
  description,
  durationMinutes,
  questions,
  user,
}) => {
  const quizzesRef = collection(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "chapters",
    chapterId,
    "quizzes"
  );

  // Create quiz document
  const quizDoc = await addDoc(quizzesRef, {
    title,
    description: description || "",
    type: "chapter",
    classId,
    subjectId,
    chapterId,
    durationMinutes,
    totalQuestions: questions.length,
    questions, // array of {questionId, classId, subjectId, chapterId}
    createdBy: user?.uid || "admin",
    createdAt: serverTimestamp(),
    status: "published", // can use later: draft/published
  });

  // 🔄 Update usage field in all selected questions
  for (const q of questions) {
    const qRef = doc(
      firestoreDB,
      "classes",
      q.classId,
      "subjects",
      q.subjectId,
      "chapters",
      q.chapterId,
      "questions",
      q.questionId
    );
    await updateDoc(qRef, {
      usage: arrayUnion({
        quizId: quizDoc.id,
        quizTitle: title,
        quizType: "chapter",
        levelLabel: title,
        createdAt: new Date(),
      }),
    });
  }

  return quizDoc.id;
};

// 📌 Create Subject-Level Quiz
export const createSubjectQuiz = async ({
  classId,
  subjectId,
  title,
  description,
  durationMinutes,
  questions,
  user,
}) => {
  const quizzesRef = collection(
    firestoreDB,
    "classes",
    classId,
    "subjects",
    subjectId,
    "quizzes"
  );

  const quizDoc = await addDoc(quizzesRef, {
    title,
    description: description || "",
    type: "subject",
    classId,
    subjectId,
    durationMinutes,
    totalQuestions: questions.length,
    questions,
    createdBy: user?.uid || "admin",
    createdAt: serverTimestamp(),
    status: "published",
  });

  // 🔄 Update usage in each question
  for (const q of questions) {
    const qRef = doc(
      firestoreDB,
      "classes",
      q.classId,
      "subjects",
      q.subjectId,
      "chapters",
      q.chapterId,
      "questions",
      q.questionId
    );

    await updateDoc(qRef, {
      usage: arrayUnion({
        quizId: quizDoc.id,
        quizTitle: title,
        quizType: "subject",
        levelLabel: title,
        createdAt: new Date(), // ⚠ never use serverTimestamp() inside arrayUnion
      }),
    });
  }

  return quizDoc.id;
};

export const createClassQuiz = async ({
  classId,
  title,
  description,
  durationMinutes,
  questions,
  user,
}) => {
  const quizzesRef = collection(firestoreDB, "classes", classId, "quizzes");

  // Create quiz document
  const quizDoc = await addDoc(quizzesRef, {
    title,
    description: description || "",
    type: "class",
    classId,
    durationMinutes,
    totalQuestions: questions.length,
    questions,
    createdBy: user?.uid || "admin",
    createdAt: serverTimestamp(),
    status: "published",
  });

  // 🔄 Update question usage tracking
  for (const q of questions) {
    const qRef = doc(
      firestoreDB,
      "classes",
      q.classId,
      "subjects",
      q.subjectId,
      "chapters",
      q.chapterId,
      "questions",
      q.questionId
    );
    await updateDoc(qRef, {
      usage: arrayUnion({
        quizId: quizDoc.id,
        quizTitle: title,
        quizType: "class",
        levelLabel: title,
        createdAt: new Date(),
      }),
    });
  }

  return quizDoc.id;
};
