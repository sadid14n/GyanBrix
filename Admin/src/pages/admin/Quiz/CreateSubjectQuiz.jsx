import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { getAllClasses } from "../../../services/classManager";
import { getAllSubjects } from "../../../services/subjectManager";
import { getAllChapters } from "../../../services/chapterManager";

import { useAuth } from "../../../context/AuthContext";
import {
  createSubjectQuiz,
  updateSubjectQuiz,
  getQuestionsByChapter,
} from "../../../services/quizManager";

import { useEditQuiz } from "../../../context/EditQuizContext";
import { useNavigate } from "react-router-dom";

const CreateSubjectQuiz = () => {
  const { user } = useAuth();
  const { quizEditingMode, clearEditing } = useEditQuiz();
  const navigate = useNavigate();

  // ⚡ Dropdown values
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  // ⚡ Selected dropdown
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  // ⚡ Questions
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // ⚡ Quiz details
  const [quizTitle, setQuizTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [description, setDescription] = useState("");

  // ⚡ Edit mode stored quiz data
  const [pendingQuizEdit, setPendingQuizEdit] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // -------------------------------------------------------------------
  // 1️⃣ Prepare edit mode: store quiz data
  // -------------------------------------------------------------------
  useEffect(() => {
    if (quizEditingMode && quizEditingMode.mode === "subject") {
      setPendingQuizEdit(quizEditingMode.quizData);
    }
  }, [quizEditingMode]);

  // -------------------------------------------------------------------
  // 2️⃣ Load classes
  // -------------------------------------------------------------------
  useEffect(() => {
    getAllClasses().then(setClasses);
  }, []);

  // Auto select class (edit mode)
  useEffect(() => {
    if (!pendingQuizEdit || classes.length === 0) return;
    setSelectedClassId(pendingQuizEdit.classId);
  }, [pendingQuizEdit, classes]);

  // -------------------------------------------------------------------
  // 3️⃣ Load subjects when class changes
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!selectedClassId) {
      setSubjects([]);
      setSelectedSubjectId("");
      return;
    }
    getAllSubjects(selectedClassId).then(setSubjects);
  }, [selectedClassId]);

  // Auto select subject (edit mode)
  useEffect(() => {
    if (!pendingQuizEdit || subjects.length === 0) return;
    setSelectedSubjectId(pendingQuizEdit.subjectId);
  }, [pendingQuizEdit, subjects]);

  // -------------------------------------------------------------------
  // 4️⃣ Load chapters, and then load all questions in subject
  // -------------------------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      if (!selectedSubjectId) {
        setChapters([]);
        setQuestions([]);
        return;
      }

      // get chapters
      const chaps = await getAllChapters(selectedClassId, selectedSubjectId);
      setChapters(chaps);

      // Now load questions from all chapters
      setLoading(true);
      let combined = [];

      for (const chap of chaps) {
        const qs = await getQuestionsByChapter(
          selectedClassId,
          selectedSubjectId,
          chap.id
        );

        combined.push(
          ...qs.map((q) => ({
            ...q,
            chapterId: chap.id,
            classId: selectedClassId,
            subjectId: selectedSubjectId,
          }))
        );
      }

      setQuestions(combined);
      setLoading(false);
    };

    loadData();
  }, [selectedSubjectId]);

  // -------------------------------------------------------------------
  // 5️⃣ Auto-fill question selection and quiz fields for edit mode
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!pendingQuizEdit || questions.length === 0) return;

    // Fill text inputs
    setQuizTitle(pendingQuizEdit.title);
    setDurationMinutes(pendingQuizEdit.durationMinutes);
    setDescription(pendingQuizEdit.description || "");

    // Select previously selected questions
    setSelectedQuestions(
      pendingQuizEdit.questions.map((q) => ({
        questionId: q.questionId,
        classId: q.classId,
        subjectId: q.subjectId,
        chapterId: q.chapterId,
      }))
    );
  }, [pendingQuizEdit, questions]);

  // -------------------------------------------------------------------
  // QUESTION selection handler
  // -------------------------------------------------------------------
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
          classId: q.classId,
          subjectId: q.subjectId,
          chapterId: q.chapterId,
        },
      ]);
    }
  };

  // -------------------------------------------------------------------
  // SUBMIT HANDLER (CREATE + UPDATE)
  // -------------------------------------------------------------------
  const handleSubmit = async () => {
    if (!quizTitle.trim()) return alert("Quiz title required");
    if (selectedQuestions.length === 0)
      return alert("Select at least 1 question");

    setSubmitting(true);

    try {
      // ⭐ EDIT MODE
      if (pendingQuizEdit) {
        await updateSubjectQuiz({
          quizId: pendingQuizEdit.id,
          classId: selectedClassId,
          subjectId: selectedSubjectId,
          title: quizTitle,
          description,
          durationMinutes,
          questions: selectedQuestions,
          previousQuestions: pendingQuizEdit.questions,
        });

        clearEditing();
        alert("Subject quiz updated successfully!");
        navigate("/admin/quiz/quiz-management/manage-quizzes");
        return;
      }

      // ⭐ CREATE MODE
      await createSubjectQuiz({
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        title: quizTitle,
        description,
        durationMinutes,
        questions: selectedQuestions,
        user,
      });

      alert("Subject quiz created successfully!");
      setQuizTitle("");
      setDescription("");
      setSelectedQuestions([]);

      navigate("/admin/quiz/quiz-management");
    } catch (err) {
      console.error(err);
      alert("Failed to save quiz");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------------
  // UI COMPONENT
  // -------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-heading">
          {pendingQuizEdit ? "Edit Subject Quiz" : "Create Subject Quiz"}
        </h1>
        <p className="text-text-subtle mt-1">
          Select questions from multiple chapters within a subject.
        </p>
      </div>

      {/* Selectors */}
      <div className="admin-card grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Class */}
        <div>
          <label className="admin-label">Class</label>
          <select
            className="admin-input"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">Select Class</option>
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
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions */}
      {selectedSubjectId && (
        <div className="admin-card">
          <h2 className="text-lg font-heading font-semibold mb-3">
            Select Questions
          </h2>

          {loading ? (
            <p>Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-text-subtle">No questions found.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {questions.map((q, i) => {
                const selected = selectedQuestions.some(
                  (item) => item.questionId === q.id
                );

                return (
                  <div
                    key={q.id}
                    className={`border p-4 rounded-lg cursor-pointer ${
                      selected
                        ? "bg-success/10 border-success"
                        : "bg-surface/60"
                    }`}
                    onClick={() => toggleSelection(q)}
                  >
                    <div className="flex justify-between">
                      <p className="font-medium">
                        Q{i + 1}. {q.question}
                      </p>
                      {selected && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                    </div>

                    <p className="text-xs mt-1 text-text-subtle">
                      Chapter:{" "}
                      {chapters.find((c) => c.id === q.chapterId)?.title}
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
            <p className="text-xs text-text-subtle mt-2">
              Selected: {selectedQuestions.length} question(s)
            </p>
          )}
        </div>
      )}

      {/* Quiz details */}
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
            <label className="admin-label">Description</label>
            <textarea
              className="admin-input min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Duration (minutes)</label>
            <input
              className="admin-input"
              type="number"
              min={10}
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

export default CreateSubjectQuiz;
