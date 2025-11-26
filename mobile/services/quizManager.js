import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
} from "@react-native-firebase/firestore";

import { firebaseApp } from "./firebaseConfig";

const db = getFirestore(firebaseApp);

/* --------------------------------------------------------
   🔥 FETCH QUIZZES
-------------------------------------------------------- */

// 📌 1. CLASS-LEVEL QUIZZES
export const getClassQuizzes = async (classId) => {
  try {
    const qRef = collection(db, "classes", classId, "quizzes");
    const snap = await getDocs(qRef);

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Error loading class quizzes:", err);
    return [];
  }
};

// 📌 2. SUBJECT-LEVEL QUIZZES
export const getSubjectQuizzes = async (classId, subjectId) => {
  try {
    const qRef = collection(
      db,
      "classes",
      classId,
      "subjects",
      subjectId,
      "quizzes"
    );

    const snap = await getDocs(qRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Error loading subject quizzes:", err);
    return [];
  }
};

// 📌 3. CHAPTER-LEVEL QUIZZES
export const getChapterQuizzes = async (classId, subjectId, chapterId) => {
  try {
    const qRef = collection(
      db,
      "classes",
      classId,
      "subjects",
      subjectId,
      "chapters",
      chapterId,
      "quizzes"
    );

    const snap = await getDocs(qRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Error loading chapter quizzes:", err);
    return [];
  }
};

/* --------------------------------------------------------
   🔥 FETCH QUESTION DETAILS
-------------------------------------------------------- */

// Each question in quiz contains:
/// { questionId, classId, subjectId, chapterId }

export const getQuestionDetails = async (qRefObj) => {
  try {
    const qRef = doc(
      db,
      "classes",
      qRefObj.classId,
      "subjects",
      qRefObj.subjectId,
      "chapters",
      qRefObj.chapterId,
      "questions",
      qRefObj.questionId
    );

    const snap = await getDoc(qRef);
    if (!snap.exists()) return null;

    const raw = snap.data();

    // 🔥 Convert your array-based structure into React Native expected format
    return {
      id: snap.id,
      question: raw.question,

      // Convert array → optionA, optionB...
      optionA: raw.options?.[0] || null,
      optionB: raw.options?.[1] || null,
      optionC: raw.options?.[2] || null,
      optionD: raw.options?.[3] || null,

      // Convert correctIndex → "optionA" / "optionB"
      correctOption:
        raw.correctIndex === 0
          ? "optionA"
          : raw.correctIndex === 1
          ? "optionB"
          : raw.correctIndex === 2
          ? "optionC"
          : raw.correctIndex === 3
          ? "optionD"
          : null,

      explanation: raw.explanation || "",
      difficulty: raw.difficulty || "medium",
      marks: raw.marks || 1,
    };
  } catch (error) {
    console.error("Error loading question:", error);
    return null;
  }
};

/* --------------------------------------------------------
   🔥 FETCH QUIZ DETAILS (UNIFIED FOR ALL TYPES)
-------------------------------------------------------- */

export const getQuizDetails = async ({
  quizId,
  classId,
  subjectId,
  chapterId,
  type,
}) => {
  try {
    let quizRef;

    // Determine path based on quiz type
    if (type === "class") {
      quizRef = doc(db, "classes", classId, "quizzes", quizId);
    } else if (type === "subject") {
      quizRef = doc(
        db,
        "classes",
        classId,
        "subjects",
        subjectId,
        "quizzes",
        quizId
      );
    } else if (type === "chapter") {
      quizRef = doc(
        db,
        "classes",
        classId,
        "subjects",
        subjectId,
        "chapters",
        chapterId,
        "quizzes",
        quizId
      );
    } else {
      throw new Error("Invalid quiz type: " + type);
    }

    // Fetch quiz
    const snap = await getDoc(quizRef);
    if (!snap.exists()) return null;

    const quizData = { id: snap.id, ...snap.data() };

    // Fetch full QUESTIONS (using your existing function)
    // const fullQuestions = await loadFullQuizQuestions(quizData);

    const fullQuestions = quizData.questions
      ? await loadFullQuizQuestions(quizData)
      : [];

    return {
      ...quizData,
      fullQuestions,
    };
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    return null;
  }
};

// Fetch all question details for a quiz
export const loadFullQuizQuestions = async (quiz) => {
  const result = [];

  for (const q of quiz.questions) {
    const data = await getQuestionDetails(q);
    if (data) result.push(data);
  }

  return result;
};

/* --------------------------------------------------------
   🔥 EVALUATE QUIZ
-------------------------------------------------------- */

export const evaluateQuiz = (questions, userAnswers) => {
  let correct = 0;
  let wrong = 0;

  const detailed = questions.map((q) => {
    const userAnswer = userAnswers[q.id];
    const right = q.correctOption;

    const isCorrect = userAnswer === right;
    if (isCorrect) correct++;
    else wrong++;

    return {
      questionId: q.id,
      question: q.question,
      selectedOption: userAnswer || null,
      correctOption: right,
      isCorrect,
    };
  });

  const total = questions.length;

  return {
    correct,
    wrong,
    total,
    score: Math.round((correct / total) * 100),
    detailed,
  };
};

/* --------------------------------------------------------
   🔥 SAVE QUIZ ATTEMPT
-------------------------------------------------------- */

export const saveQuizAttempt = async (userId, quiz, result) => {
  try {
    const attemptsRef = collection(db, "users", userId, "attempts");

    await addDoc(attemptsRef, {
      quizId: quiz.id,
      quizTitle: quiz.title,
      quizType: quiz.type,
      classId: quiz.classId,
      subjectId: quiz.subjectId || null,
      chapterId: quiz.chapterId || null,

      totalQuestions: result.total,
      correct: result.correct,
      wrong: result.wrong,
      score: result.score,

      detailed: result.detailed,
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error saving attempt:", error);
    return false;
  }
};

/* --------------------------------------------------------
   🔥 FETCH USER ATTEMPT HISTORY
-------------------------------------------------------- */

export const getUserAttempts = async (userId) => {
  try {
    const attemptsRef = collection(db, "users", userId, "attempts");

    const snap = await getDocs(attemptsRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error loading attempts:", error);
    return [];
  }
};

// export const getUserAttempts = async (userId) => {
//   const attemptsRef = collection(
//     firestoreDB,
//     "users",
//     userId,
//     "quizAttempts"
//   );

//   const q = query(attemptsRef, orderBy("timestamp", "desc"));
//   const snapshot = await getDocs(q);

//   return snapshot.docs.map((docSnap) => ({
//     id: docSnap.id,
//     ...docSnap.data(),
//   }));
// };
