import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { getAllClasses } from "../../../services/classManager";
import { getAllSubjects } from "../../../services/subjectManager";
import { getAllChapters } from "../../../services/chapterManager";
import { useAuth } from "../../../context/AuthContext";

import {
  createChapterQuiz,
  getQuestionsByChapter,
  updateChapterQuiz,
} from "../../../services/quizManager";

import { useEditQuiz } from "../../../context/EditQuizContext";
import { useNavigate } from "react-router-dom";

const CreateChapterQuiz = () => {
  const { user } = useAuth();
  const { quizEditingMode, clearEditing } = useEditQuiz();
  const navigate = useNavigate();

  /** -------------------------------------------
   *  DROPDOWNS
   -------------------------------------------- */
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  /** -------------------------------------------
   * QUESTIONS
   -------------------------------------------- */
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  /** -------------------------------------------
   * QUIZ DETAILS
   -------------------------------------------- */
  const [quizTitle, setQuizTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [description, setDescription] = useState("");

  /** -------------------------------------------
   * EDIT MODE HANDLING
   -------------------------------------------- */
  const [pendingQuizEdit, setPendingQuizEdit] = useState(null);

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /** -------------------------------------------
   * STEP 1 — Store edit mode state
   -------------------------------------------- */
  useEffect(() => {
    if (quizEditingMode?.mode === "chapter") {
      setPendingQuizEdit(quizEditingMode.quizData);
    }
  }, [quizEditingMode]);

  /** -------------------------------------------
   * STEP 2 — Load classes
   -------------------------------------------- */
  useEffect(() => {
    getAllClasses().then(setClasses);
  }, []);

  /** -------------------------------------------
   * STEP 3 — Apply CLASS for edit (only after classes loaded)
   -------------------------------------------- */
  useEffect(() => {
    if (!pendingQuizEdit || classes.length === 0) return;
    setSelectedClassId(pendingQuizEdit.classId);
  }, [pendingQuizEdit, classes]);

  /** -------------------------------------------
   * STEP 4 — Load subjects when class changes
   -------------------------------------------- */
  useEffect(() => {
    if (!selectedClassId) {
      setSubjects([]);
      setSelectedSubjectId("");
      return;
    }

    getAllSubjects(selectedClassId).then(setSubjects);
  }, [selectedClassId]);

  /** -------------------------------------------
   * STEP 5 — Apply SUBJECT for edit (after subjects loaded)
   -------------------------------------------- */
  useEffect(() => {
    if (!pendingQuizEdit || subjects.length === 0) return;
    setSelectedSubjectId(pendingQuizEdit.subjectId);
  }, [pendingQuizEdit, subjects]);

  /** -------------------------------------------
   * STEP 6 — Load chapters when subject changes
   -------------------------------------------- */
  useEffect(() => {
    if (!selectedSubjectId) {
      setChapters([]);
      setSelectedChapterId("");
      return;
    }

    getAllChapters(selectedClassId, selectedSubjectId).then(setChapters);
  }, [selectedSubjectId]);

  /** -------------------------------------------
   * STEP 7 — Apply CHAPTER + QUIZ DETAILS + QUESTIONS (after chapters loaded)
   -------------------------------------------- */
  useEffect(() => {
    if (!pendingQuizEdit) return;
    if (chapters.length === 0) return;

    setSelectedChapterId(pendingQuizEdit.chapterId);
    setQuizTitle(pendingQuizEdit.title);
    setDurationMinutes(pendingQuizEdit.durationMinutes);
    setDescription(pendingQuizEdit.description || "");

    // Ensure each question has full structure
    setSelectedQuestions(
      pendingQuizEdit.questions.map((item) => ({
        questionId: item.questionId,
        classId: item.classId,
        subjectId: item.subjectId,
        chapterId: item.chapterId,
      }))
    );
  }, [pendingQuizEdit, chapters]);

  /** -------------------------------------------
   * STEP 8 — Load questions of chapter
   -------------------------------------------- */
  useEffect(() => {
    if (!selectedChapterId) {
      setQuestions([]);
      return;
    }

    setLoadingQuestions(true);

    getQuestionsByChapter(selectedClassId, selectedSubjectId, selectedChapterId)
      .then(setQuestions)
      .finally(() => setLoadingQuestions(false));
  }, [selectedChapterId]);

  /** -------------------------------------------
   * SELECT QUESTION
   -------------------------------------------- */
  const toggleSelection = (question) => {
    const exists = selectedQuestions.find((q) => q.questionId === question.id);

    if (exists) {
      setSelectedQuestions((prev) =>
        prev.filter((q) => q.questionId !== question.id)
      );
    } else {
      setSelectedQuestions((prev) => [
        ...prev,
        {
          questionId: question.id,
          classId: selectedClassId,
          subjectId: selectedSubjectId,
          chapterId: selectedChapterId,
        },
      ]);
    }
  };

  /** -------------------------------------------
   * SUBMIT QUIZ (CREATE + UPDATE)
   -------------------------------------------- */
  const handleSubmit = async () => {
    if (!quizTitle.trim()) return alert("Quiz title required");
    if (selectedQuestions.length === 0)
      return alert("Select at least 1 question");

    setSubmitting(true);

    try {
      /** 🔥 EDIT MODE */
      if (pendingQuizEdit) {
        await updateChapterQuiz({
          quizId: pendingQuizEdit.id,
          classId: selectedClassId,
          subjectId: selectedSubjectId,
          chapterId: selectedChapterId,
          title: quizTitle,
          description,
          durationMinutes,
          questions: selectedQuestions,
          previousQuestions: pendingQuizEdit.questions,
        });

        clearEditing();
        alert("Quiz updated successfully!");
        navigate("/admin/quiz/quiz-management/manage-quizzes");
        return;
      }

      /** 🔥 CREATE MODE */
      await createChapterQuiz({
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        chapterId: selectedChapterId,
        title: quizTitle,
        description,
        durationMinutes,
        questions: selectedQuestions,
        user,
      });

      alert("Chapter-level quiz created successfully!");
      setQuizTitle("");
      setDescription("");
      setSelectedQuestions([]);

      navigate("/admin/quiz/quiz-management");
    } catch (error) {
      console.error("QUIZ SAVE ERROR → ", error);
      alert("Failed to save quiz");
    } finally {
      setSubmitting(false);
    }
  };

  /** -------------------------------------------
   * RENDER UI
   -------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-heading">
          {pendingQuizEdit ? "Edit Chapter Quiz" : "Create Chapter Quiz"}
        </h1>
        <p className="text-text-subtle mt-1">
          Select questions from a chapter to build a quiz
        </p>
      </div>

      {/* Selectors */}
      <div className="admin-card grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Class */}
        <div>
          <label className="admin-label">Class</label>
          <select
            className="admin-input"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="admin-label">Subject</label>
          <select
            className="admin-input"
            disabled={!selectedClassId}
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter */}
        <div>
          <label className="admin-label">Chapter</label>
          <select
            className="admin-input"
            disabled={!selectedSubjectId}
            value={selectedChapterId}
            onChange={(e) => setSelectedChapterId(e.target.value)}
          >
            <option value="">Select chapter</option>
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions */}
      {selectedChapterId && (
        <div className="admin-card">
          <h2 className="text-lg font-heading font-semibold mb-3">
            Select Questions
          </h2>

          {loadingQuestions ? (
            <p>Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-text-subtle">No questions in this chapter.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {questions.map((q, i) => {
                const selected = selectedQuestions.some(
                  (s) => s.questionId === q.id
                );

                return (
                  <div
                    key={q.id}
                    onClick={() => toggleSelection(q)}
                    className={`border p-4 rounded-lg cursor-pointer ${
                      selected
                        ? "bg-success/10 border-success"
                        : "bg-surface/60 border-border"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium">
                        Q{i + 1}. {q.question}
                      </p>
                      {selected && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                    </div>

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
        </div>
      )}

      {/* Quiz Details */}
      {selectedQuestions.length > 0 && (
        <div className="admin-card space-y-4">
          <h2 className="text-lg font-heading font-semibold">Quiz Details</h2>

          <div>
            <label className="admin-label">Quiz Title</label>
            <input
              className="admin-input"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Description (optional)</label>
            <textarea
              className="admin-input min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="admin-label">Duration (minutes)</label>
            <input
              className="admin-input"
              type="number"
              min={5}
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

export default CreateChapterQuiz;
