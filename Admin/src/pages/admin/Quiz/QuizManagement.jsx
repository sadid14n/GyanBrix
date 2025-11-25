// src/pages/admin/QuizManagement.jsx
import { Link } from "react-router-dom";
import {
  ClipboardList,
  FilePlus2,
  Layers3,
  School,
  LineChart,
} from "lucide-react";

const QuizManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-heading">
            Quiz Management
          </h1>
          <p className="text-text-subtle mt-1">
            Manage questions and quizzes for all classes and subjects
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Questions */}
        <Link
          to="/admin/quiz/quiz-management/add-questions"
          className="admin-card group cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FilePlus2 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-heading font-semibold text-text-heading mb-2 group-hover:text-primary transition-colors">
            Add Questions
          </h3>
          <p className="text-sm text-text-subtle">
            Add multiple MCQ questions under specific chapters in bulk.
          </p>
        </Link>

        {/* Create Chapter-Level Quiz */}
        <Link
          to="/admin/quiz/quiz-management/create-chapter-quiz"
          className="admin-card group cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-success" />
            </div>
          </div>
          <h3 className="text-lg font-heading font-semibold text-text-heading mb-2 group-hover:text-success transition-colors">
            Chapter-Level Quizzes
          </h3>
          <p className="text-sm text-text-subtle">
            Create quizzes using questions from a single chapter.
          </p>
        </Link>

        {/* Create Subject-Level Quiz */}
        <Link
          to="/admin/quiz/quiz-management/create-subject-quiz"
          className="admin-card group cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Layers3 className="h-6 w-6 text-accent" />
            </div>
          </div>
          <h3 className="text-lg font-heading font-semibold text-text-heading mb-2 group-hover:text-accent transition-colors">
            Subject-Level Quizzes
          </h3>
          <p className="text-sm text-text-subtle">
            Combine questions from multiple chapters within a subject.
          </p>
        </Link>

        {/* Create Class-Level Quiz */}
        <Link
          to="/admin/quiz/quiz-management/create-class-quiz"
          className="admin-card group cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <School className="h-6 w-6 text-warning" />
            </div>
          </div>
          <h3 className="text-lg font-heading font-semibold text-text-heading mb-2 group-hover:text-warning transition-colors">
            Class-Level Quizzes
          </h3>
          <p className="text-sm text-text-subtle">
            Create mega tests using questions from all subjects of a class.
          </p>
        </Link>

        {/* Manage Questions */}
        <Link
          to="/admin/quiz/quiz-management/manage-questions"
          className="admin-card group cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-info/10 rounded-lg flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-info" />
            </div>
          </div>
          <h3 className="text-lg font-heading font-semibold text-text-heading mb-2 group-hover:text-info transition-colors">
            Manage Questions
          </h3>
          <p className="text-sm text-text-subtle">
            View, edit, or delete questions across chapters.
          </p>
        </Link>

        {/* Future: Analytics */}
        <div className="admin-card opacity-70">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-muted/10 rounded-lg flex items-center justify-center">
              <LineChart className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-heading font-semibold text-text-heading mb-2">
            Quiz Analytics (Coming Soon)
          </h3>
          <p className="text-sm text-text-subtle">
            Track performance, difficulty, and student progress over time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizManagement;
