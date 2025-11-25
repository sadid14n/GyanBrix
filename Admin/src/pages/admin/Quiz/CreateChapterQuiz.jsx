import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { getAllClasses } from "../../../services/classManager";
import { getAllSubjects } from "../../../services/subjectManager";
import { getAllChapters } from "../../../services/chapterManager";
import { useAuth } from "../../../context/AuthContext";
import {
  createChapterQuiz,
  getQuestionsByChapter,
} from "../../../services/quizManager";

const CreateChapterQuiz = () => {
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const [quizTitle, setQuizTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [description, setDescription] = useState("");

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load class list
  useEffect(() => {
    getAllClasses().then(setClasses);
  }, []);

  // Load subjects when class selected
  useEffect(() => {
    if (!selectedClassId) return setSubjects([]), setSelectedSubjectId("");
    getAllSubjects(selectedClassId).then(setSubjects);
  }, [selectedClassId]);

  // Load chapters when subject selected
  useEffect(() => {
    if (!selectedSubjectId) return setChapters([]), setSelectedChapterId("");
    getAllChapters(selectedClassId, selectedSubjectId).then(setChapters);
  }, [selectedSubjectId]);

  // Load questions when chapter selected
  useEffect(() => {
    if (!selectedChapterId) return setQuestions([]);

    setLoadingQuestions(true);
    getQuestionsByChapter(selectedClassId, selectedSubjectId, selectedChapterId)
      .then((qs) => setQuestions(qs))
      .finally(() => setLoadingQuestions(false));
  }, [selectedChapterId]);

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

  const handleSubmit = async () => {
    if (!quizTitle.trim()) return alert("Quiz title required");
    if (selectedQuestions.length === 0)
      return alert("Select at least 1 question");

    setSubmitting(true);
    try {
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
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-heading">
          Create Chapter Quiz
        </h1>
        <p className="text-text-subtle mt-1">
          Select questions from a chapter to build a quiz
        </p>
      </div>

      {/* Step 1: Select class → subject → chapter */}
      <div className="admin-card grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Step 2: Show questions */}
      {selectedChapterId && (
        <div className="admin-card">
          <h2 className="text-lg font-heading font-semibold mb-3">
            Select Questions
          </h2>

          {loadingQuestions ? (
            <p>Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-text-subtle">
              No questions found in this chapter.
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {questions.map((q, i) => {
                const selected = selectedQuestions.some(
                  (s) => s.questionId === q.id
                );
                return (
                  <div
                    key={q.id}
                    className={`border p-4 rounded-lg cursor-pointer ${
                      selected
                        ? "bg-success/10 border-success"
                        : "bg-surface/60 border-border"
                    }`}
                    onClick={() => toggleSelection(q)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium">
                        Q{i + 1}. {q.question}
                      </p>
                      {selected && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedQuestions.length > 0 && (
            <p className="text-xs text-text-subtle mt-1">
              Selected: {selectedQuestions.length} question(s)
            </p>
          )}
        </div>
      )}

      {/* Step 3: Quiz details */}
      {selectedQuestions.length > 0 && (
        <div className="admin-card space-y-4">
          <h2 className="text-lg font-heading font-semibold">Quiz Details</h2>

          <div>
            <label className="admin-label">Quiz Title</label>
            <input
              type="text"
              className="admin-input"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="e.g., Chapter 3 Practice Test"
            />
          </div>

          <div>
            <label className="admin-label">Description (optional)</label>
            <textarea
              className="admin-input min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quiz description..."
            />
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
            {submitting ? "Creating..." : "Create Quiz"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateChapterQuiz;
