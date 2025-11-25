import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { getAllClasses } from "../../../services/classManager";
import { getAllSubjects } from "../../../services/subjectManager";
import { getAllChapters } from "../../../services/chapterManager";
import { useAuth } from "../../../context/AuthContext";
import {
  createClassQuiz,
  getQuestionsByChapter,
} from "../../../services/quizManager";

const CreateClassQuiz = () => {
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [chaptersLoaded, setChaptersLoaded] = useState(false);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const [quizTitle, setQuizTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [description, setDescription] = useState("");

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load Classes
  useEffect(() => {
    getAllClasses().then(setClasses);
  }, []);

  // Load Subjects + All Questions from class
  useEffect(() => {
    const loadAllQuestions = async () => {
      if (!selectedClassId) return;

      setLoadingQuestions(true);
      setSubjects([]);
      setQuestions([]);
      setChaptersLoaded(false);

      const subs = await getAllSubjects(selectedClassId);
      setSubjects(subs);

      let allQs = [];

      for (const sub of subs) {
        const chaps = await getAllChapters(selectedClassId, sub.id);

        for (const chap of chaps) {
          const qs = await getQuestionsByChapter(
            selectedClassId,
            sub.id,
            chap.id
          );

          allQs.push(
            ...qs.map((q) => ({
              ...q,
              classId: selectedClassId,
              subjectId: sub.id,
              chapterId: chap.id,
              chapterTitle: chap.title,
              subjectName: sub.name,
            }))
          );
        }
      }

      setQuestions(allQs);
      setChaptersLoaded(true);
      setLoadingQuestions(false);
    };

    loadAllQuestions();
  }, [selectedClassId]);

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

  const handleSubmit = async () => {
    if (!quizTitle.trim()) return alert("Quiz title required!");
    if (selectedQuestions.length === 0)
      return alert("Select at least 1 question!");

    setSubmitting(true);
    try {
      await createClassQuiz({
        classId: selectedClassId,
        title: quizTitle,
        description,
        durationMinutes,
        questions: selectedQuestions,
        user,
      });

      alert("Class-level quiz created successfully!");
      setSelectedQuestions([]);
      setQuizTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Error creating quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-heading">
          Create Class Quiz
        </h1>
        <p className="text-text-subtle mt-1">
          Select questions from all subjects and chapters of a class
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
            <p>Fetching subjects & questions...</p>
          ) : !chaptersLoaded ? (
            <p className="text-text-subtle">Loading chapters & questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-text-subtle">
              No questions available in this class
            </p>
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
                      {selected && <CheckCircle2 className="text-success" />}
                    </div>

                    <p className="text-xs text-text-subtle mt-1">
                      {q.subjectName} → {q.chapterTitle}
                    </p>
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
              placeholder="Description of quiz"
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
            {submitting ? "Creating..." : "Create Quiz"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateClassQuiz;
