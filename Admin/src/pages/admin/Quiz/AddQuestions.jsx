// src/pages/admin/AddQuestions.jsx
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { getAllClasses } from "../../../services/classManager";
import { getAllSubjects } from "../../../services/subjectManager";
import { getAllChapters } from "../../../services/chapterManager";
import {
  addQuestionsBulk,
  getQuestionsByChapter,
} from "../../../services/quizManager";

const emptyQuestionBlock = () => ({
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
  difficulty: "medium",
  marks: 1,
});

const AddQuestions = () => {
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const [questionBlocks, setQuestionBlocks] = useState([emptyQuestionBlock()]);
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 1️⃣ Load all classes on mount
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const cls = await getAllClasses();
        setClasses(cls);
      } catch (err) {
        console.error("Error loading classes:", err);
        alert("Failed to load classes.");
      }
    };
    loadClasses();
  }, []);

  // 2️⃣ When class changes, load its subjects
  useEffect(() => {
    const loadSubjects = async () => {
      if (!selectedClassId) {
        setSubjects([]);
        setSelectedSubjectId("");
        setChapters([]);
        setSelectedChapterId("");
        return;
      }

      try {
        const subs = await getAllSubjects(selectedClassId);
        setSubjects(subs);
        setSelectedSubjectId("");
        setChapters([]);
        setSelectedChapterId("");
      } catch (err) {
        console.error("Error loading subjects:", err);
        alert("Failed to load subjects for this class.");
      }
    };
    loadSubjects();
  }, [selectedClassId]);

  // 3️⃣ When subject changes, load its chapters
  useEffect(() => {
    const loadChapters = async () => {
      if (!selectedClassId || !selectedSubjectId) {
        setChapters([]);
        setSelectedChapterId("");
        return;
      }

      try {
        const chaps = await getAllChapters(selectedClassId, selectedSubjectId);
        setChapters(chaps);
        setSelectedChapterId("");
      } catch (err) {
        console.error("Error loading chapters:", err);
        alert("Failed to load chapters.");
      }
    };
    loadChapters();
  }, [selectedClassId, selectedSubjectId]);

  // 4️⃣ When chapter selected, load existing questions
  useEffect(() => {
    const loadQuestions = async () => {
      if (!selectedClassId || !selectedSubjectId || !selectedChapterId) {
        setExistingQuestions([]);
        return;
      }

      setLoadingExisting(true);
      try {
        const qs = await getQuestionsByChapter(
          selectedClassId,
          selectedSubjectId,
          selectedChapterId
        );
        setExistingQuestions(qs);
      } catch (err) {
        console.error("Error loading questions:", err);
        alert("Failed to load existing questions.");
      } finally {
        setLoadingExisting(false);
      }
    };
    loadQuestions();
  }, [selectedClassId, selectedSubjectId, selectedChapterId]);

  // 🧩 Handlers for question blocks
  const handleQuestionChange = (index, field, value) => {
    setQuestionBlocks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestionBlocks((prev) => {
      const updated = [...prev];
      const options = [...updated[qIndex].options];
      options[optIndex] = value;
      updated[qIndex].options = options;
      return updated;
    });
  };

  const addQuestionBlock = () => {
    setQuestionBlocks((prev) => [...prev, emptyQuestionBlock()]);
  };

  const removeQuestionBlock = (index) => {
    setQuestionBlocks((prev) => {
      if (prev.length === 1) return prev; // don't remove last one
      return prev.filter((_, i) => i !== index);
    });
  };

  // 🧪 Validate question blocks before submit
  const validateQuestions = () => {
    const cleaned = questionBlocks
      // Remove completely empty blocks
      .filter((q) => q.question.trim() || q.options.some((opt) => opt.trim()));

    if (cleaned.length === 0) {
      alert("Please fill at least one question or option.");
      return null;
    }

    for (let i = 0; i < cleaned.length; i++) {
      const q = cleaned[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1}: question text is required.`);
        return null;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`Question ${i + 1}: option ${j + 1} is empty.`);
          return null;
        }
      }

      if (
        typeof q.correctIndex !== "number" ||
        q.correctIndex < 0 ||
        q.correctIndex >= q.options.length
      ) {
        alert(`Question ${i + 1}: please select a valid correct option.`);
        return null;
      }
    }

    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !selectedSubjectId || !selectedChapterId) {
      alert("Please select class, subject and chapter first.");
      return;
    }

    const cleaned = validateQuestions();
    if (!cleaned) return;

    setSubmitting(true);
    try {
      await addQuestionsBulk(
        selectedClassId,
        selectedSubjectId,
        selectedChapterId,
        cleaned,
        user
      );

      alert(`${cleaned.length} question(s) added successfully!`);

      // reset question blocks
      setQuestionBlocks([emptyQuestionBlock()]);

      // reload existing questions
      const qs = await getQuestionsByChapter(
        selectedClassId,
        selectedSubjectId,
        selectedChapterId
      );
      setExistingQuestions(qs);
    } catch (err) {
      console.error("Error adding questions:", err);
      alert("Failed to add questions. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-heading">
            Add Questions
          </h1>
          <p className="text-text-subtle mt-1">
            Add multiple MCQ questions to a specific chapter in one go.
          </p>
        </div>
      </div>

      {/* Selection Card */}
      <div className="admin-card space-y-4">
        <h2 className="text-lg font-heading font-semibold text-text-heading">
          1. Select Class, Subject & Chapter
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-text-body mb-1">
              Class
            </label>
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

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-text-body mb-1">
              Subject
            </label>
            <select
              className="admin-input"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={!selectedClassId}
            >
              <option value="">Select subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter */}
          <div>
            <label className="block text-sm font-medium text-text-body mb-1">
              Chapter
            </label>
            <select
              className="admin-input"
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              disabled={!selectedSubjectId}
            >
              <option value="">Select chapter</option>
              {chapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  {chap.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedChapterId && (
          <p className="text-xs text-text-subtle mt-2">
            Existing questions in this chapter:{" "}
            {loadingExisting ? "Loading..." : existingQuestions.length}
          </p>
        )}
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="admin-card space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-text-heading">
            2. Add Questions
          </h2>
          {/* <button
            type="button"
            onClick={addQuestionBlock}
            className="admin-button-secondary flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Another Question
          </button> */}
        </div>

        {questionBlocks.map((q, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 space-y-3 bg-surface/60"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-text-heading">
                Question {index + 1}
              </h3>
              {questionBlocks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestionBlock(index)}
                  className="text-error hover:bg-error/10 rounded-full p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Question text */}
            <div>
              <label className="block text-xs font-medium text-text-body mb-1">
                Question Text
              </label>
              <textarea
                className="admin-input min-h-[80px]"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                placeholder="Enter the question..."
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex}>
                  <label className="block text-xs font-medium text-text-body mb-1">
                    Option {optIndex + 1}
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(index, optIndex, e.target.value)
                    }
                    placeholder={`Option ${optIndex + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Correct option + difficulty + marks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Correct option */}
              <div>
                <label className="block text-xs font-medium text-text-body mb-1">
                  Correct Option
                </label>
                <select
                  className="admin-input"
                  value={q.correctIndex}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      "correctIndex",
                      Number(e.target.value)
                    )
                  }
                >
                  {q.options.map((_, i) => (
                    <option key={i} value={i}>
                      Option {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-medium text-text-body mb-1">
                  Difficulty
                </label>
                <select
                  className="admin-input"
                  value={q.difficulty}
                  onChange={(e) =>
                    handleQuestionChange(index, "difficulty", e.target.value)
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Marks */}
              <div>
                <label className="block text-xs font-medium text-text-body mb-1">
                  Marks
                </label>
                <input
                  type="number"
                  min={1}
                  className="admin-input"
                  value={q.marks}
                  onChange={(e) =>
                    handleQuestionChange(index, "marks", Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-xs font-medium text-text-body mb-1">
                Explanation (optional)
              </label>
              <textarea
                className="admin-input min-h-[60px]"
                value={q.explanation}
                onChange={(e) =>
                  handleQuestionChange(index, "explanation", e.target.value)
                }
                placeholder="Explanation shown after the question is answered..."
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-6">
          <button
            type="button"
            onClick={addQuestionBlock}
            className="admin-button-secondary flex items-center cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Another Question
          </button>

          <button
            type="submit"
            className="admin-button-primary cursor-pointer"
            disabled={
              submitting ||
              !selectedClassId ||
              !selectedSubjectId ||
              !selectedChapterId
            }
          >
            {submitting ? "Saving..." : "Save Questions"}
          </button>
        </div>
      </form>

      {/* Existing Questions List (simple view) */}
      {selectedChapterId && (
        <div className="admin-card">
          <h2 className="text-lg font-heading font-semibold text-text-heading mb-3">
            Existing Questions in this Chapter
          </h2>
          {loadingExisting ? (
            <p className="text-sm text-text-subtle">Loading...</p>
          ) : existingQuestions.length === 0 ? (
            <p className="text-sm text-text-subtle">No questions added yet.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {existingQuestions.map((q, i) => (
                <div
                  key={q.id}
                  className="border border-border rounded-md p-3 bg-surface/70"
                >
                  <p className="text-sm font-medium text-text-heading">
                    Q{i + 1}. {q.question}
                  </p>
                  {q.usage?.length ? (
                    <p className="mt-1 text-xs text-text-subtle">
                      Used in: {q.usage.map((u) => u.levelLabel).join(", ")}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-text-subtle">
                      Not used in any quiz yet.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddQuestions;
