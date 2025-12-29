import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

import QuestionEditModal from "./QuestionEditModal"; // separate component for edit
import { useAuth } from "../../../context/AuthContext";
import { getAllClasses } from "../../../services/classManager";
import { getAllSubjects } from "../../../services/subjectManager";
import { getAllChapters } from "../../../services/chapterManager";
import {
  deleteQuestion,
  getQuestionsByChapter,
  updateQuestion,
} from "../../../services/quizManager";

const ManageQuestions = () => {
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingQuestion, setEditingQuestion] = useState(null);

  // Load classes on mount
  useEffect(() => {
    async function loadClasses() {
      const cls = await getAllClasses();
      setClasses(cls);
    }
    loadClasses();
  }, []);

  // Load subjects when class selected
  useEffect(() => {
    if (!selectedClassId) {
      setSubjects([]);
      setSelectedSubjectId("");
      return;
    }
    async function loadSubjects() {
      const subs = await getAllSubjects(selectedClassId);
      setSubjects(subs);
      setSelectedSubjectId("");
    }
    loadSubjects();
  }, [selectedClassId]);

  // Load chapters when subject selected
  useEffect(() => {
    if (!selectedSubjectId) {
      setChapters([]);
      setSelectedChapterId("");
      return;
    }
    async function loadChapters() {
      const chaps = await getAllChapters(selectedClassId, selectedSubjectId);
      setChapters(chaps);
      setSelectedChapterId("");
    }
    loadChapters();
  }, [selectedSubjectId]);

  // Load questions when chapter selected
  const fetchQuestions = async () => {
    if (!selectedClassId || !selectedSubjectId || !selectedChapterId) return;

    setLoading(true);
    try {
      const qs = await getQuestionsByChapter(
        selectedClassId,
        selectedSubjectId,
        selectedChapterId
      );
      setQuestions(qs);
    } catch (err) {
      console.error(err);
      alert("Unable to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedChapterId]);

  const handleDelete = async (questionId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirm) return;

    try {
      await deleteQuestion(
        selectedClassId,
        selectedSubjectId,
        selectedChapterId,
        questionId
      );
      await fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Failed to delete question.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-heading">
          Manage Questions
        </h1>
        <p className="text-text-subtle mt-1">
          View, edit or delete questions from chapters
        </p>
      </div>

      {/* Selector Card */}
      <div className="admin-card grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Class */}
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
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
          <label className="block text-sm font-medium mb-1">Subject</label>
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
          <label className="block text-sm font-medium mb-1">Chapter</label>
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

      {/* Questions List */}
      <div className="admin-card">
        <h2 className="text-lg font-heading font-semibold text-text-heading mb-4">
          Questions in this Chapter
        </h2>

        {loading ? (
          <p>Loading questions...</p>
        ) : !questions.length ? (
          <p className="text-text-subtle">
            No questions found for this chapter.
          </p>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className="border border-border rounded-lg p-4 bg-surface/70"
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-text-heading">
                    Q{i + 1}. {q.question}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="text-primary hover:bg-primary/10 rounded p-1"
                      onClick={() => setEditingQuestion(q)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-error hover:bg-error/10 rounded p-1"
                      onClick={() => handleDelete(q.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {q.usage?.length > 0 && (
                  <p className="mt-1 text-xs text-text-subtle">
                    Used in: {q.usage.map((u) => u.levelLabel).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingQuestion && (
        <QuestionEditModal
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={async (updatedFields) => {
            await updateQuestion(
              selectedClassId,
              selectedSubjectId,
              selectedChapterId,
              editingQuestion.id,
              updatedFields
            );
            setEditingQuestion(null);
            fetchQuestions();
          }}
        />
      )}
    </div>
  );
};

export default ManageQuestions;
