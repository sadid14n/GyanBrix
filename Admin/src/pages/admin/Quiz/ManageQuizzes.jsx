import { useEffect, useState } from "react";
import { FileEdit, Trash2 } from "lucide-react";

import { getAllClasses } from "../../../services/classManager";
import { getAllSubjects } from "../../../services/subjectManager";
import { getAllChapters } from "../../../services/chapterManager";
import {
  deleteQuiz,
  getChapterQuizzes,
  getClassQuizzes,
  getSubjectQuizzes,
} from "../../../services/quizManager";
import { useEditQuiz } from "../../../context/EditQuizContext";
import { useNavigate } from "react-router-dom";

const ManageQuizzes = () => {
  const { startEditing } = useEditQuiz();

  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllClasses().then(setClasses);
  }, []);

  useEffect(() => {
    if (!selectedClassId) return setSubjects([]), setSelectedSubjectId("");
    getAllSubjects(selectedClassId).then(setSubjects);
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedSubjectId) return setChapters([]), setSelectedChapterId("");
    getAllChapters(selectedClassId, selectedSubjectId).then(setChapters);
  }, [selectedSubjectId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    let result = [];

    if (selectedClassId && !selectedSubjectId) {
      result = await getClassQuizzes(selectedClassId);
    } else if (selectedClassId && selectedSubjectId && !selectedChapterId) {
      result = await getSubjectQuizzes(selectedClassId, selectedSubjectId);
    } else if (selectedClassId && selectedSubjectId && selectedChapterId) {
      result = await getChapterQuizzes(
        selectedClassId,
        selectedSubjectId,
        selectedChapterId
      );
    }

    setQuizzes(result);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedClassId) fetchQuizzes();
  }, [selectedClassId, selectedSubjectId, selectedChapterId]);

  const handleDelete = async (quiz) => {
    if (!confirm("Delete this quiz? This action cannot be undone.")) return;
    try {
      await deleteQuiz(quiz);
      fetchQuizzes();
      alert("Quiz deleted successfully");
    } catch {
      alert("Failed to delete quiz");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-heading">
          Manage Quizzes
        </h1>
        <p className="text-text-subtle mt-1">
          View, modify or delete existing quizzes
        </p>
      </div>

      {/* Filters */}
      <div className="admin-card grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <select
          className="admin-input"
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          disabled={!selectedClassId}
        >
          <option value="">All Subjects / Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="admin-input"
          value={selectedChapterId}
          onChange={(e) => setSelectedChapterId(e.target.value)}
          disabled={!selectedSubjectId}
        >
          <option value="">All Chapters / Select Chapter</option>
          {chapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.title}
            </option>
          ))}
        </select>
      </div>

      {/* Quiz List */}
      <div className="admin-card">
        <h2 className="text-lg font-heading font-semibold mb-3">Quizzes</h2>

        {loading ? (
          <p>Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-text-subtle">No quizzes found.</p>
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="border border-border rounded-lg p-4 bg-surface/75"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-text-heading">
                      {quiz.title}
                    </p>
                    <p className="text-xs text-text-subtle">
                      {quiz.type.toUpperCase()} | {quiz.totalQuestions}{" "}
                      questions | {quiz.durationMinutes} min
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {/* <button
                      className="p-1 text-primary hover:bg-primary/10 rounded"
                      onClick={() =>
                        alert(
                          "Editing quiz means reselecting questions.\n\nYou will be taken to the respective creation page with preselected questions.\n(Feature ready to implement next)"
                        )
                      }
                    >
                      <FileEdit className="h-4 w-4" />
                    </button> */}

                    <button
                      className="p-1 text-primary hover:bg-primary/10 rounded"
                      onClick={() => {
                        startEditing(quiz.type, quiz);
                        if (quiz.type === "chapter") {
                          navigate(
                            `/admin/quiz/quiz-management/create-chapter-quiz`
                          ); // redirect
                        } else if (quiz.type === "subject") {
                          navigate(
                            `/admin/quiz/quiz-management/create-subject-quiz`
                          );
                        } else {
                          navigate(
                            `/admin/quiz/quiz-management/create-class-quiz`
                          );
                        }
                      }}
                    >
                      <FileEdit className="h-4 w-4" />
                    </button>

                    <button
                      className="p-1 text-error hover:bg-error/10 rounded"
                      onClick={() => handleDelete(quiz)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuizzes;
