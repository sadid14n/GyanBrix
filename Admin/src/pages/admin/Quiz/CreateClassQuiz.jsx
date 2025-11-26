import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { getAllClasses } from "../../../services/classManager";
import { getAllSubjects } from "../../../services/subjectManager";
import { getAllChapters } from "../../../services/chapterManager";

import { useAuth } from "../../../context/AuthContext";
import {
  createClassQuiz,
  updateClassQuiz,
  getQuestionsByChapter,
} from "../../../services/quizManager";

import { useEditQuiz } from "../../../context/EditQuizContext";
import { useNavigate } from "react-router-dom";

const CreateClassQuiz = () => {
  const { user } = useAuth();
  const { quizEditingMode, clearEditing } = useEditQuiz();
  const navigate = useNavigate();

  // Dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // All questions from class
  const [questions, setQuestions] = useState([]);

  // Selected values
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Quiz details
  const [quizTitle, setQuizTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [description, setDescription] = useState("");

  // Edit mode stored quiz
  const [pendingQuizEdit, setPendingQuizEdit] = useState(null);

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ----------------------------
  // 1️⃣ PRELOAD EDIT MODE DATA
  // ----------------------------
  useEffect(() => {
    if (quizEditingMode && quizEditingMode.mode === "class") {
      setPendingQuizEdit(quizEditingMode.quizData);
    }
  }, [quizEditingMode]);

  // ----------------------------
  // 2️⃣ LOAD CLASS LIST
  // ----------------------------
  useEffect(() => {
    getAllClasses().then(setClasses);
  }, []);

  // Auto-select class (edit mode)
  useEffect(() => {
    if (!pendingQuizEdit || classes.length === 0) return;
    setSelectedClassId(pendingQuizEdit.classId);
  }, [pendingQuizEdit, classes]);

  // ----------------------------
  // 3️⃣ LOAD SUBJECTS + ALL QUESTIONS (ALL CHAPTERS)
  // ----------------------------
  useEffect(() => {
    const loadAllQuestions = async () => {
      if (!selectedClassId) {
        setSubjects([]);
        setQuestions([]);
        return;
      }

      setLoadingQuestions(true);

      const subs = await getAllSubjects(selectedClassId);
      setSubjects(subs);

      let combinedQuestions = [];

      for (const sub of subs) {
        const chaps = await getAllChapters(selectedClassId, sub.id);

        for (const chap of chaps) {
          const qs = await getQuestionsByChapter(
            selectedClassId,
            sub.id,
            chap.id
          );

          combinedQuestions.push(
            ...qs.map((q) => ({
              ...q,
              classId: selectedClassId,
              subjectId: sub.id,
              chapterId: chap.id,
              subjectName: sub.name,
              chapterTitle: chap.title,
            }))
          );
        }
      }

      setQuestions(combinedQuestions);
      setLoadingQuestions(false);
    };

    loadAllQuestions();
  }, [selectedClassId]);

  // ----------------------------
  // 4️⃣ AUTO-FILL SELECTED QUESTIONS + QUIZ DETAILS
  // ----------------------------
  useEffect(() => {
    if (!pendingQuizEdit || questions.length === 0) return;

    // Text inputs
    setQuizTitle(pendingQuizEdit.title);
    setDurationMinutes(pendingQuizEdit.durationMinutes);
    setDescription(pendingQuizEdit.description || "");

    // Select previously used questions
    setSelectedQuestions(
      pendingQuizEdit.questions.map((q) => ({
        questionId: q.questionId,
        classId: q.classId,
        subjectId: q.subjectId,
        chapterId: q.chapterId,
      }))
    );
  }, [pendingQuizEdit, questions]);

  // ----------------------------
  // QUESTION SELECTOR
  // ----------------------------
  const toggleSelection = (q) => {
    const exists = selectedQuestions.some((item) => item.questionId === q.id);

    if (exists) {
      setSelectedQuestions((prev) =>
        prev.filter((item) => item.questionId !== q.id)
      );
    } else {
      setSelectedQuestions((prev) => [
        ...prev,
        {
          questionId: q.id,
          classId: selectedClassId,
          subjectId: q.subjectId,
          chapterId: q.chapterId,
        },
      ]);
    }
  };

  // ----------------------------
  // SUBMIT — CREATE OR UPDATE
  // ----------------------------
  const handleSubmit = async () => {
    if (!quizTitle.trim()) return alert("Quiz title required");
    if (selectedQuestions.length === 0)
      return alert("Select at least 1 question");

    setSubmitting(true);

    try {
      // ⭐ EDIT MODE
      if (pendingQuizEdit) {
        await updateClassQuiz({
          quizId: pendingQuizEdit.id,
          classId: selectedClassId,
          title: quizTitle,
          description,
          durationMinutes,
          questions: selectedQuestions,
          previousQuestions: pendingQuizEdit.questions,
        });

        clearEditing();
        alert("Class quiz updated successfully!");
        navigate("/admin/quiz/quiz-management/manage-quizzes");
        return;
      }

      // ⭐ CREATE MODE
      await createClassQuiz({
        classId: selectedClassId,
        title: quizTitle,
        description,
        durationMinutes,
        questions: selectedQuestions,
        user,
      });

      alert("Class quiz created successfully!");
      setSelectedQuestions([]);
      setQuizTitle("");
      setDescription("");

      navigate("/admin/quiz/quiz-management");
    } catch (err) {
      console.error(err);
      alert("Failed to save quiz");
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-heading">
          {pendingQuizEdit ? "Edit Class Quiz" : "Create Class Quiz"}
        </h1>
        <p className="text-text-subtle mt-1">
          Combine questions from all subjects & chapters of a class.
        </p>
      </div>

      {/* Step 1 — Select Class */}
      <div className="admin-card">
        <label className="admin-label">Select Class</label>
        <select
          className="admin-input"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          <option value="">Select class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2 — Select Questions */}
      {selectedClassId && (
        <div className="admin-card">
          <h2 className="text-lg font-heading font-semibold mb-3">
            Select Questions
          </h2>

          {loadingQuestions ? (
            <p>Loading subjects, chapters & questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-text-subtle">No questions found.</p>
          ) : (
            <div className="space-y-3 max-h-[450px] overflow-y-auto">
              {questions.map((q, idx) => {
                const selected = selectedQuestions.some(
                  (s) => s.questionId === q.id
                );

                return (
                  <div
                    key={q.id}
                    className={`border p-4 rounded-md cursor-pointer ${
                      selected
                        ? "bg-success/10 border-success"
                        : "bg-surface/60 border-border"
                    }`}
                    onClick={() => toggleSelection(q)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium">
                        Q{idx + 1}. {q.question}
                      </p>
                      {selected && (
                        <CheckCircle2 className="text-success h-5 w-5" />
                      )}
                    </div>

                    <p className="text-xs text-text-subtle mt-1">
                      {q.subjectName} → {q.chapterTitle}
                    </p>

                    {q.usage?.length > 0 && (
                      <p className="mt-1 text-xs text-text-subtle">
                        Used in: {q.usage.map((u) => u.levelLabel).join(", ")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {selectedQuestions.length > 0 && (
            <p className="text-xs mt-1 text-text-subtle">
              Selected: {selectedQuestions.length} question(s)
            </p>
          )}
        </div>
      )}

      {/* Step 3 — Quiz Details */}
      {selectedQuestions.length > 0 && (
        <div className="admin-card space-y-4">
          <h2 className="text-lg font-heading font-semibold">Quiz Details</h2>

          <div>
            <label className="admin-label">Quiz Title</label>
            <input
              className="admin-input"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="e.g., Final Class Test"
            />
          </div>

          <div>
            <label className="admin-label">Description (optional)</label>
            <textarea
              className="admin-input min-h-[70px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="This quiz covers all subjects of the class."
            />
          </div>

          <div>
            <label className="admin-label">Duration (minutes)</label>
            <input
              type="number"
              min={10}
              className="admin-input"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </div>

          <button
            className="admin-button-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : pendingQuizEdit
              ? "Update Quiz"
              : "Create Quiz"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateClassQuiz;
